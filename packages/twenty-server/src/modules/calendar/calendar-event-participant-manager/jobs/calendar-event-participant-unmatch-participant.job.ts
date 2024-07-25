import { Scope } from '@nestjs/common';

import { Process } from 'src/engine/integrations/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/integrations/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/integrations/message-queue/message-queue.constants';
import { CalendarEventParticipantService } from 'src/modules/calendar/calendar-event-participant-manager/services/calendar-event-participant.service';

export type CalendarEventParticipantUnmatchParticipantJobData = {
  workspaceId: string;
  email: string;
  personId?: string;
  workspaceMemberId?: string;
};

@Processor({
  queueName: MessageQueue.calendarQueue,
  scope: Scope.REQUEST,
})
export class CalendarEventParticipantUnmatchParticipantJob {
  constructor(
    private readonly calendarEventParticipantService: CalendarEventParticipantService,
  ) {}

  @Process(CalendarEventParticipantUnmatchParticipantJob.name)
  async handle(
    data: CalendarEventParticipantUnmatchParticipantJobData,
  ): Promise<void> {
    const { email, personId, workspaceMemberId } = data;

    await this.calendarEventParticipantService.unmatchCalendarEventParticipants(
      email,
      personId,
      workspaceMemberId,
    );
  }
}
