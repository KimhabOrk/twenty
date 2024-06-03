import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ObjectRecordCreateEvent } from 'src/engine/integrations/event-emitter/types/object-record-create.event';
import { ObjectRecordDeleteEvent } from 'src/engine/integrations/event-emitter/types/object-record-delete.event';
import { MessageQueue } from 'src/engine/integrations/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/engine/integrations/message-queue/services/message-queue.service';
import { BlocklistWorkspaceEntity } from 'src/modules/connected-account/standard-objects/blocklist.workspace-entity';
import {
  BlocklistItemDeleteMessagesJobData,
  BlocklistItemDeleteMessagesJob,
} from 'src/modules/messaging/blocklist-manager/jobs/messaging-blocklist-item-delete-messages.job';
import { ObjectRecordUpdateEvent } from 'src/engine/integrations/event-emitter/types/object-record-update.event';

@Injectable()
export class MessagingBlocklistListener {
  constructor(
    @Inject(MessageQueue.messagingQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  @OnEvent('blocklist.created')
  async handleCreatedEvent(
    payload: ObjectRecordCreateEvent<BlocklistWorkspaceEntity>,
  ) {
    await this.messageQueueService.add<BlocklistItemDeleteMessagesJobData>(
      BlocklistItemDeleteMessagesJob.name,
      {
        workspaceId: payload.workspaceId,
        blocklistItemId: payload.recordId,
      },
    );
  }

  @OnEvent('blocklist.deleted')
  async handleDeletedEvent(
    payload: ObjectRecordDeleteEvent<BlocklistWorkspaceEntity>,
  ) {}

  @OnEvent('blocklist.updated')
  async handleUpdatedEvent(
    payload: ObjectRecordUpdateEvent<BlocklistWorkspaceEntity>,
  ) {
    await this.messageQueueService.add<BlocklistItemDeleteMessagesJobData>(
      BlocklistItemDeleteMessagesJob.name,
      {
        workspaceId: payload.workspaceId,
        blocklistItemId: payload.recordId,
      },
    );
  }
}
