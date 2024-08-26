import { Logger } from '@nestjs/common';

import { Any, IsNull } from 'typeorm';

import { Process } from 'src/engine/integrations/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/integrations/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/integrations/message-queue/message-queue.constants';
import { FieldActorSource } from 'src/engine/metadata-modules/field-metadata/composite-types/actor.composite-type';
import { InjectObjectMetadataRepository } from 'src/engine/object-metadata-repository/object-metadata-repository.decorator';
import { TwentyORMManager } from 'src/engine/twenty-orm/twenty-orm.manager';
import { ConnectedAccountRepository } from 'src/modules/connected-account/repositories/connected-account.repository';
import { ConnectedAccountWorkspaceEntity } from 'src/modules/connected-account/standard-objects/connected-account.workspace-entity';
import { CreateCompanyAndContactService } from 'src/modules/contact-creation-manager/services/create-company-and-contact.service';
import {
  MessageChannelContactAutoCreationPolicy,
  MessageChannelWorkspaceEntity,
} from 'src/modules/messaging/common/standard-objects/message-channel.workspace-entity';
import { MessageParticipantWorkspaceEntity } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';

export type MessagingCreateCompanyAndContactAfterSyncJobData = {
  workspaceId: string;
  messageChannelId: string;
};

@Processor(MessageQueue.messagingQueue)
export class MessagingCreateCompanyAndContactAfterSyncJob {
  private readonly logger = new Logger(
    MessagingCreateCompanyAndContactAfterSyncJob.name,
  );
  constructor(
    private readonly createCompanyAndContactService: CreateCompanyAndContactService,
    @InjectObjectMetadataRepository(ConnectedAccountWorkspaceEntity)
    private readonly connectedAccountRepository: ConnectedAccountRepository,
    private readonly twentyORMManager: TwentyORMManager,
  ) {}

  @Process(MessagingCreateCompanyAndContactAfterSyncJob.name)
  async handle(
    data: MessagingCreateCompanyAndContactAfterSyncJobData,
  ): Promise<void> {
    this.logger.log(
      `create contacts and companies after sync for workspace ${data.workspaceId} and messageChannel ${data.messageChannelId}`,
    );
    const { workspaceId, messageChannelId } = data;

    const messageChannelRepository =
      await this.twentyORMManager.getRepository<MessageChannelWorkspaceEntity>(
        'messageChannel',
      );

    const messageChannel = await messageChannelRepository.findOneOrFail({
      where: {
        id: messageChannelId,
      },
    });

    const { contactAutoCreationPolicy, connectedAccountId } = messageChannel;

    if (
      contactAutoCreationPolicy === MessageChannelContactAutoCreationPolicy.NONE
    ) {
      return;
    }

    const connectedAccount = await this.connectedAccountRepository.getById(
      connectedAccountId,
      workspaceId,
    );

    if (!connectedAccount) {
      throw new Error(
        `Connected account with id ${connectedAccountId} not found in workspace ${workspaceId}`,
      );
    }

    const messageParticipantRepository =
      await this.twentyORMManager.getRepository<MessageParticipantWorkspaceEntity>(
        'messageParticipant',
      );

    const directionFilter =
      contactAutoCreationPolicy ===
      MessageChannelContactAutoCreationPolicy.SENT_AND_RECEIVED
        ? Any(['incoming', 'outgoing'])
        : 'outgoing';

    const contactsToCreate = await messageParticipantRepository.find({
      where: {
        message: {
          messageChannelMessageAssociations: {
            messageChannelId,
            direction: directionFilter,
          },
        },
        personId: IsNull(),
        workspaceMemberId: IsNull(),
      },
    });

    await this.createCompanyAndContactService.createCompaniesAndContactsAndUpdateParticipants(
      connectedAccount,
      contactsToCreate,
      workspaceId,
      FieldActorSource.EMAIL,
    );

    this.logger.log(
      `create contacts and companies after sync for workspace ${data.workspaceId} and messageChannel ${data.messageChannelId} done`,
    );
  }
}
