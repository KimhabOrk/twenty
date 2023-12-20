import { Args, Query, Field, Resolver, ObjectType } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { Column, Entity } from 'typeorm';

import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { Workspace } from 'src/core/workspace/workspace.entity';
import { AuthWorkspace } from 'src/decorators/auth-workspace.decorator';
import { TimelineMessagingService } from 'src/core/messaging/timeline-messaging.service';

@Entity({ name: 'timelineMessage', schema: 'core' })
@ObjectType('TimelineMessage')
class TimelineMessage {
  @Field()
  @Column()
  read: boolean;

  @Field()
  @Column()
  senderName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  senderPictureUrl: string;

  @Field()
  @Column()
  numberOfMessagesInThread: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  subject: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  body: string;

  @Field()
  @Column()
  receivedAt: Date;
}

@UseGuards(JwtAuthGuard)
@Resolver(() => [TimelineMessage])
export class TimelineMessagingResolver {
  constructor(
    private readonly timelineMessagingService: TimelineMessagingService,
  ) {}

  @Query(() => [TimelineMessage])
  async getTimelineMessagesFromPersonId(
    @AuthWorkspace() { id: workspaceId }: Workspace,
    @Args('personId') personId: string,
  ) {
    const timelineMessages =
      await this.timelineMessagingService.getMessagesFromPersonIds(
        workspaceId,
        [personId],
      );

    return timelineMessages;
  }

  @Query(() => [TimelineMessage])
  async getTimelineMessagesFromCompanyId(
    @AuthWorkspace() { id: workspaceId }: Workspace,
    @Args('companyId') companyId: string,
  ) {
    const timelineMessages =
      await this.timelineMessagingService.getMessagesFromCompanyId(
        workspaceId,
        companyId,
      );

    return timelineMessages;
  }
}
