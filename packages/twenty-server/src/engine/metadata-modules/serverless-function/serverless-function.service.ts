import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { join } from 'path';

import { TypeOrmQueryService } from '@ptc-org/nestjs-query-typeorm';
import { FileUpload } from 'graphql-upload';
import { Repository } from 'typeorm';

import { FileFolder } from 'src/engine/core-modules/file/interfaces/file-folder.interface';
import { ServerlessExecuteResult } from 'src/engine/integrations/serverless/drivers/interfaces/serverless-driver.interface';

import { FileStorageService } from 'src/engine/integrations/file-storage/file-storage.service';
import { readFileContent } from 'src/engine/integrations/file-storage/utils/read-file-content';
import { SOURCE_FILE_NAME } from 'src/engine/integrations/serverless/drivers/constants/source-file-name';
import { ServerlessService } from 'src/engine/integrations/serverless/serverless.service';
import { CreateServerlessFunctionFromFileInput } from 'src/engine/metadata-modules/serverless-function/dtos/create-serverless-function-from-file.input';
import { UpdateServerlessFunctionInput } from 'src/engine/metadata-modules/serverless-function/dtos/update-serverless-function.input';
import {
  ServerlessFunctionEntity,
  ServerlessFunctionSyncStatus,
} from 'src/engine/metadata-modules/serverless-function/serverless-function.entity';
import {
  ServerlessFunctionException,
  ServerlessFunctionExceptionCode,
} from 'src/engine/metadata-modules/serverless-function/serverless-function.exception';
import { serverlessFunctionCreateHash } from 'src/engine/metadata-modules/serverless-function/utils/serverless-function-create-hash.utils';
import { isDefined } from 'src/utils/is-defined';

@Injectable()
export class ServerlessFunctionService extends TypeOrmQueryService<ServerlessFunctionEntity> {
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly serverlessService: ServerlessService,
    @InjectRepository(ServerlessFunctionEntity, 'metadata')
    private readonly serverlessFunctionRepository: Repository<ServerlessFunctionEntity>,
  ) {
    super(serverlessFunctionRepository);
  }

  private getServerlessFunctionFolder({
    serverlessFunction,
    workspaceId,
    version,
  }: {
    serverlessFunction: ServerlessFunctionEntity;
    workspaceId: string;
    version: string;
  }) {
    const computedVersion =
      version === 'latest' ? serverlessFunction.latestVersion : version;

    return join(
      'workspace-' + workspaceId,
      FileFolder.ServerlessFunction,
      serverlessFunction.id,
      computedVersion,
    );
  }

  async getServerlessFunctionSourceCode(
    workspaceId: string,
    id: string,
    version: string,
  ) {
    const serverlessFunction = await this.serverlessFunctionRepository.findOne({
      where: {
        id,
        workspaceId,
      },
    });

    if (!serverlessFunction) {
      throw new ServerlessFunctionException(
        `Function does not exist`,
        ServerlessFunctionExceptionCode.SERVERLESS_FUNCTION_NOT_FOUND,
      );
    }

    const folderPath = this.getServerlessFunctionFolder({
      serverlessFunction,
      workspaceId,
      version,
    });

    const fileStream = await this.fileStorageService.read({
      folderPath,
      filename: SOURCE_FILE_NAME,
    });

    return await readFileContent(fileStream);
  }

  async executeOneServerlessFunction(
    id: string,
    workspaceId: string,
    payload: object | undefined = undefined,
    version = 'latest',
  ): Promise<ServerlessExecuteResult> {
    const functionToExecute = await this.serverlessFunctionRepository.findOne({
      where: {
        id,
        workspaceId,
      },
    });

    if (!functionToExecute) {
      throw new ServerlessFunctionException(
        `Function does not exist`,
        ServerlessFunctionExceptionCode.SERVERLESS_FUNCTION_NOT_FOUND,
      );
    }

    if (
      functionToExecute.syncStatus === ServerlessFunctionSyncStatus.NOT_READY
    ) {
      await this.serverlessService.build(functionToExecute, version);
      await super.updateOne(functionToExecute.id, {
        syncStatus: ServerlessFunctionSyncStatus.READY,
      });
    }

    return this.serverlessService.execute(functionToExecute, payload, version);
  }

  async publishOneServerlessFunction(id: string, workspaceId: string) {
    const existingServerlessFunction =
      await this.serverlessFunctionRepository.findOne({
        where: { id, workspaceId },
      });

    if (!existingServerlessFunction) {
      throw new ServerlessFunctionException(
        `Function does not exist`,
        ServerlessFunctionExceptionCode.SERVERLESS_FUNCTION_NOT_FOUND,
      );
    }

    if (isDefined(existingServerlessFunction.latestVersion)) {
      const latestCode = await this.getServerlessFunctionSourceCode(
        workspaceId,
        id,
        'latest',
      );
      const draftCode = await this.getServerlessFunctionSourceCode(
        workspaceId,
        id,
        'draft',
      );

      if (
        serverlessFunctionCreateHash(latestCode) ===
        serverlessFunctionCreateHash(draftCode)
      ) {
        throw new Error(
          'Cannot publish a new version when code has not changed',
        );
      }
    }

    const { newVersion } = await this.serverlessService.publish(
      existingServerlessFunction,
    );

    await super.updateOne(existingServerlessFunction.id, {
      latestVersion: newVersion,
    });

    return await this.findById(existingServerlessFunction.id);
  }

  async deleteOneServerlessFunction(id: string, workspaceId: string) {
    const existingServerlessFunction =
      await this.serverlessFunctionRepository.findOne({
        where: { id, workspaceId },
      });

    if (!existingServerlessFunction) {
      throw new ServerlessFunctionException(
        `Function does not exist`,
        ServerlessFunctionExceptionCode.SERVERLESS_FUNCTION_NOT_FOUND,
      );
    }

    await super.deleteOne(id);

    await this.serverlessService.delete(existingServerlessFunction);

    return existingServerlessFunction;
  }

  async updateOneServerlessFunction(
    serverlessFunctionInput: UpdateServerlessFunctionInput,
    workspaceId: string,
  ) {
    const existingServerlessFunction =
      await this.serverlessFunctionRepository.findOne({
        where: { id: serverlessFunctionInput.id, workspaceId },
      });

    if (!existingServerlessFunction) {
      throw new ServerlessFunctionException(
        `Function does not exist`,
        ServerlessFunctionExceptionCode.SERVERLESS_FUNCTION_NOT_FOUND,
      );
    }

    await super.updateOne(existingServerlessFunction.id, {
      name: serverlessFunctionInput.name,
      description: serverlessFunctionInput.description,
      syncStatus: ServerlessFunctionSyncStatus.NOT_READY,
    });

    const fileFolder = this.getServerlessFunctionFolder({
      serverlessFunction: existingServerlessFunction,
      workspaceId,
      version: 'draft',
    });

    await this.fileStorageService.write({
      file: serverlessFunctionInput.code,
      name: SOURCE_FILE_NAME,
      mimeType: undefined,
      folder: fileFolder,
    });

    return await this.findById(existingServerlessFunction.id);
  }

  async createOneServerlessFunction(
    serverlessFunctionInput: CreateServerlessFunctionFromFileInput,
    code: FileUpload | string,
    workspaceId: string,
  ) {
    const existingServerlessFunction =
      await this.serverlessFunctionRepository.findOne({
        where: { name: serverlessFunctionInput.name, workspaceId },
      });

    if (existingServerlessFunction) {
      throw new ServerlessFunctionException(
        `Function already exists`,
        ServerlessFunctionExceptionCode.SERVERLESS_FUNCTION_ALREADY_EXIST,
      );
    }

    let typescriptCode: string;

    if (typeof code === 'string') {
      typescriptCode = code;
    } else {
      typescriptCode = await readFileContent(code.createReadStream());
    }

    const createdServerlessFunction = await super.createOne({
      ...serverlessFunctionInput,
      workspaceId,
      sourceCodeHash: serverlessFunctionCreateHash(typescriptCode),
    });

    const draftFileFolder = this.getServerlessFunctionFolder({
      serverlessFunction: createdServerlessFunction,
      workspaceId,
      version: 'draft',
    });

    await this.fileStorageService.write({
      file: typescriptCode,
      name: SOURCE_FILE_NAME,
      mimeType: undefined,
      folder: draftFileFolder,
    });

    return await this.findById(createdServerlessFunction.id);
  }
}
