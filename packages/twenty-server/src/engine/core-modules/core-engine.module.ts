import { Module } from '@nestjs/common';

import { WorkspaceModule } from 'src/engine/core-modules/workspace/workspace.module';
import { UserModule } from 'src/engine/core-modules/user/user.module';
import { AppTokenModule } from 'src/engine/core-modules/app-token/app-token.module';
import { AuthModule } from 'src/engine/core-modules/auth/auth.module';
import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { OpenApiModule } from 'src/engine/core-modules/open-api/open-api.module';
import { TimelineMessagingModule } from 'src/engine/core-modules/messaging/timeline-messaging.module';
import { TimelineCalendarEventModule } from 'src/engine/core-modules/calendar/timeline-calendar-event.module';
import { BillingModule } from 'src/engine/core-modules/billing/billing.module';
import { HealthModule } from 'src/engine/core-modules/health/health.module';
import { AISQLQueryModule } from 'src/engine/core-modules/ai-sql-query/ai-sql-query.module';
import { PostgresCredentialsModule } from 'src/engine/core-modules/postgres-credentials/postgres-credentials.module';
import { CodeEngineModule } from 'src/engine/core-modules/code-engine/code-engine.module';
import { codeEngineModuleFactory } from 'src/engine/core-modules/code-engine/code-engine-module.factory';
import { EnvironmentService } from 'src/engine/integrations/environment/environment.service';
import { FileStorageService } from 'src/engine/integrations/file-storage/file-storage.service';
import { FileUploadService } from 'src/engine/core-modules/file/file-upload/services/file-upload.service';

import { ClientConfigModule } from './client-config/client-config.module';
import { FileModule } from './file/file.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    HealthModule,
    AnalyticsModule,
    AuthModule,
    BillingModule,
    ClientConfigModule,
    CodeEngineModule.forRootAsync({
      useFactory: codeEngineModuleFactory,
      inject: [EnvironmentService, FileStorageService, FileUploadService],
    }),
    FeatureFlagModule,
    FileModule,
    OpenApiModule,
    AppTokenModule,
    TimelineMessagingModule,
    TimelineCalendarEventModule,
    UserModule,
    WorkspaceModule,
    AISQLQueryModule,
    PostgresCredentialsModule,
  ],
  exports: [
    AnalyticsModule,
    AuthModule,
    CodeEngineModule,
    FeatureFlagModule,
    TimelineMessagingModule,
    TimelineCalendarEventModule,
    UserModule,
    WorkspaceModule,
  ],
})
export class CoreEngineModule {}
