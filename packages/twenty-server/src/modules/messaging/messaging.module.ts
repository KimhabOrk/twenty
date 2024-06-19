import { Module } from '@nestjs/common';

import { MessagingBlocklistManagerModule } from 'src/modules/messaging/blocklist-manager/messaging-blocklist-manager.module';
import { MessagingMessageCleanerModule } from 'src/modules/messaging/message-cleaner/messaging-message-cleaner.module';
import { MessagingImportManagerModule } from 'src/modules/messaging/message-import-manager/messaging-import-manager.module';
import { MessaginParticipantsManagerModule } from 'src/modules/messaging/message-participants-manager/messaging-participants-manager.module';
import { MessagingMonitoringModule } from 'src/modules/messaging/monitoring/messaging-monitoring.module';

@Module({
  imports: [
    MessagingImportManagerModule,
    MessagingMessageCleanerModule,
    MessaginParticipantsManagerModule,
    MessagingBlocklistManagerModule,
    MessagingMonitoringModule,
  ],
  providers: [],
  exports: [],
})
export class MessagingModule {}
