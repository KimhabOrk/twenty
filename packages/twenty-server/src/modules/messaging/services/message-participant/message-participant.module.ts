import { Module } from '@nestjs/common';

import { ObjectMetadataRepositoryModule } from 'src/engine/object-metadata-repository/object-metadata-repository.module';
import { WorkspaceDataSourceModule } from 'src/engine/workspace-datasource/workspace-datasource.module';
import { GetEmailPersonIdAndWorkspaceMemberIdMapModule } from 'src/modules/connected-account/services/get-email-person-and-workspace-member-id-map/add-person-id-and-workspace-member-id.module';
import { MessageParticipantService } from 'src/modules/messaging/services/message-participant/message-participant.service';
import { PersonObjectMetadata } from 'src/modules/person/standard-objects/person.object-metadata';

@Module({
  imports: [
    WorkspaceDataSourceModule,
    ObjectMetadataRepositoryModule.forFeature([PersonObjectMetadata]),
    GetEmailPersonIdAndWorkspaceMemberIdMapModule,
  ],
  providers: [MessageParticipantService],
  exports: [MessageParticipantService],
})
export class MessageParticipantModule {}
