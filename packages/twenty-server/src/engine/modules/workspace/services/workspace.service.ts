import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import assert from 'assert';

import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { TypeORMService } from 'src/database/typeorm/typeorm.service';
import { Workspace } from 'src/engine/modules/workspace/workspace.entity';
import { UserWorkspace } from 'src/engine/modules/user-workspace/user-workspace.entity';
import { User } from 'src/engine/modules/user/user.entity';
import { WorkspaceManagerService } from 'src/engine/workspace-manager/workspace-manager.service';
import { UserWorkspaceService } from 'src/engine/modules/user-workspace/user-workspace.service';
import { BillingService } from 'src/engine/modules/billing/billing.service';
import { DataSourceService } from 'src/engine-metadata/data-source/data-source.service';
import { ActivateWorkspaceInput } from 'src/engine/modules/workspace/dtos/activate-workspace-input';

export class WorkspaceService extends TypeOrmQueryService<Workspace> {
  constructor(
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(UserWorkspace, 'core')
    private readonly userWorkspaceRepository: Repository<UserWorkspace>,
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
    private readonly workspaceManagerService: WorkspaceManagerService,
    private readonly userWorkspaceService: UserWorkspaceService,
    private readonly billingService: BillingService,
    private readonly dataSourceService: DataSourceService,
    private readonly typeORMService: TypeORMService,
  ) {
    super(workspaceRepository);
  }

  async activateWorkspace(user: User, data: ActivateWorkspaceInput) {
    if (!data.displayName || !data.displayName.length) {
      throw new BadRequestException("'displayName' not provided");
    }
    await this.workspaceRepository.update(user.defaultWorkspace.id, {
      displayName: data.displayName,
    });
    await this.workspaceManagerService.init(user.defaultWorkspace.id);
    await this.userWorkspaceService.createWorkspaceMember(
      user.defaultWorkspace.id,
      user,
    );

    return user.defaultWorkspace;
  }

  async isWorkspaceActivated(id: string): Promise<boolean> {
    return await this.workspaceManagerService.doesDataSourceExist(id);
  }

  async deleteWorkspace(id: string, shouldDeleteCoreWorkspace = true) {
    const workspace = await this.workspaceRepository.findOneBy({ id });

    assert(workspace, 'Workspace not found');

    await this.userWorkspaceRepository.delete({ workspaceId: id });
    await this.billingService.deleteSubscription(workspace.id);

    await this.workspaceManagerService.delete(id);
    if (shouldDeleteCoreWorkspace) {
      await this.workspaceRepository.delete(id);
    }

    return workspace;
  }

  async getWorkspaceIds() {
    return this.workspaceRepository
      .find()
      .then((workspaces) => workspaces.map((workspace) => workspace.id));
  }

  private async createNewWorkspace(user: User) {
    const workspaceToCreate = this.workspaceRepository.create({
      displayName: '',
      domainName: '',
      inviteHash: v4(),
      subscriptionStatus: 'incomplete',
    });

    const workspace = await this.workspaceRepository.save(workspaceToCreate);

    await this.userRepository.save({
      id: user.id,
      defaultWorkspace: workspace,
      updatedAt: new Date().toISOString(),
    });
  }

  private async reassignDefaultWorkspace(
    currentWorkspaceId: string,
    user: User,
    worskpaces: UserWorkspace[],
  ) {
    // We'll filter all user workspaces without the one which its getting removed from
    const filteredUserWorkspaces = worskpaces.filter(
      (workspace) => workspace.workspaceId !== currentWorkspaceId,
    );

    // Loop over each workspace in the filteredUserWorkspaces array and check if it currently exists in
    // the database
    for (let index = 0; index < filteredUserWorkspaces.length; index++) {
      const userWorkspace = filteredUserWorkspaces[index];

      const nextWorkspace = await this.workspaceRepository.findOneBy({
        id: userWorkspace.workspaceId,
      });

      if (nextWorkspace) {
        await this.userRepository.save({
          id: user.id,
          defaultWorkspace: nextWorkspace,
          updatedAt: new Date().toISOString(),
        });
        break;
      }

      // if no workspaces are valid then we assign a new one
      if (index === filteredUserWorkspaces.length - 1) {
        await this.createNewWorkspace(user);
      }
    }
  }

  async removeWorkspaceMember(workspaceId: string, memberId: string) {
    const dataSourceMetadata =
      await this.dataSourceService.getLastDataSourceMetadataFromWorkspaceIdOrFail(
        workspaceId,
      );

    const workspaceDataSource =
      await this.typeORMService.connectToDataSource(dataSourceMetadata);

    // using "SELECT *" here because we will need the corresponding members userId later
    const [workspaceMember] = await workspaceDataSource?.query(
      `SELECT * FROM ${dataSourceMetadata.schema}."workspaceMember" WHERE "id" = '${memberId}'`,
    );

    if (!workspaceMember) {
      throw new NotFoundException('Member not found.');
    }

    await workspaceDataSource?.query(
      `DELETE FROM ${dataSourceMetadata.schema}."workspaceMember" WHERE "id" = '${memberId}'`,
    );

    const workspaceMemberUser = await this.userRepository.findOne({
      where: {
        id: workspaceMember.userId,
      },
      relations: ['defaultWorkspace'],
    });

    if (!workspaceMemberUser) {
      throw new NotFoundException('User not found');
    }

    const userWorkspaces = await this.userWorkspaceRepository.find({
      where: { userId: workspaceMemberUser.id },
      relations: ['workspace'],
    });

    // We want to check if we the user has signed up to more than one workspace
    if (userWorkspaces.length > 1) {
      // We neeed to check if the workspace that its getting removed from is its default workspace, if it is then
      // change the default workspace to point to the next workspace available.
      if (workspaceMemberUser.defaultWorkspace.id === workspaceId) {
        await this.reassignDefaultWorkspace(
          workspaceId,
          workspaceMemberUser,
          userWorkspaces,
        );
      }
      // if its not the default workspace then simply delete the user-workspace mapping
      await this.userWorkspaceRepository.delete({
        userId: workspaceMemberUser.id,
        workspaceId,
      });
    } else {
      await this.userWorkspaceRepository.delete({
        userId: workspaceMemberUser.id,
      });

      // After deleting the user-workspace mapping, we have a condition where we have the users default workspace points to a
      // workspace which it doesnt have access to. So we create a new workspace and make it as a default for the user.
      await this.createNewWorkspace(workspaceMemberUser);
    }

    return memberId;
  }
}
