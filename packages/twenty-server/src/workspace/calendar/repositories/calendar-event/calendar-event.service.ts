import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { WorkspaceDataSourceService } from 'src/workspace/workspace-datasource/workspace-datasource.service';
import { ObjectRecord } from 'src/workspace/workspace-sync-metadata/types/object-record';
import { CalendarEventObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects/calendar-event.object-metadata';
import { valuesStringForBatchRawQuery } from 'src/workspace/calendar-and-messaging/utils/valueStringForBatchRawQuery.util';
import { CalendarEvent } from 'src/workspace/calendar/types/calendar-event';
import { CalendarEventAttendeeObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects/calendar-event-attendee.object-metadata';

@Injectable()
export class CalendarEventService {
  constructor(
    private readonly workspaceDataSourceService: WorkspaceDataSourceService,
  ) {}

  public async getByIds(
    calendarEventIds: string[],
    workspaceId: string,
    transactionManager?: EntityManager,
  ): Promise<ObjectRecord<CalendarEventObjectMetadata>[]> {
    if (calendarEventIds.length === 0) {
      return [];
    }

    const dataSourceSchema =
      this.workspaceDataSourceService.getSchemaName(workspaceId);

    return await this.workspaceDataSourceService.executeRawQuery(
      `SELECT * FROM ${dataSourceSchema}."calendarEvent" WHERE "id" = ANY($1)`,
      [calendarEventIds],
      workspaceId,
      transactionManager,
    );
  }

  public async deleteByIds(
    calendarEventIds: string[],
    workspaceId: string,
    transactionManager?: EntityManager,
  ): Promise<void> {
    if (calendarEventIds.length === 0) {
      return;
    }

    const dataSourceSchema =
      this.workspaceDataSourceService.getSchemaName(workspaceId);

    await this.workspaceDataSourceService.executeRawQuery(
      `DELETE FROM ${dataSourceSchema}."calendarEvent" WHERE "id" = ANY($1)`,
      [calendarEventIds],
      workspaceId,
      transactionManager,
    );
  }

  public async getNonAssociatedCalendarEventIdsPaginated(
    limit: number,
    offset: number,
    workspaceId: string,
    transactionManager?: EntityManager,
  ): Promise<ObjectRecord<CalendarEventAttendeeObjectMetadata>[]> {
    const dataSourceSchema =
      this.workspaceDataSourceService.getSchemaName(workspaceId);

    const nonAssociatedCalendarEvents =
      await this.workspaceDataSourceService.executeRawQuery(
        `SELECT m.id FROM ${dataSourceSchema}."calendarEvent" m
        LEFT JOIN ${dataSourceSchema}."calendarChannelEventAssociation" ccea
        ON m.id = ccea."calendarEventId"
        WHERE ccea.id IS NULL
        LIMIT $1 OFFSET $2`,
        [limit, offset],
        workspaceId,
        transactionManager,
      );

    return nonAssociatedCalendarEvents.map(({ id }) => id);
  }

  public async getICalUIDCalendarEventIdMap(
    iCalUIDs: string[],
    workspaceId: string,
    transactionManager?: EntityManager,
  ): Promise<Map<string, string>> {
    if (iCalUIDs.length === 0) {
      return new Map();
    }

    const dataSourceSchema =
      this.workspaceDataSourceService.getSchemaName(workspaceId);

    const calendarEvents: {
      id: string;
      iCalUID: string;
    }[] = await this.workspaceDataSourceService.executeRawQuery(
      `SELECT id, "iCalUID" FROM ${dataSourceSchema}."calendarEvent" WHERE "iCalUID" = ANY($1)`,
      [iCalUIDs],
      workspaceId,
      transactionManager,
    );

    const iCalUIDsCalendarEvnetIdsMap = new Map<string, string>();

    calendarEvents.forEach((calendarEvent) => {
      iCalUIDsCalendarEvnetIdsMap.set(calendarEvent.iCalUID, calendarEvent.id);
    });

    return iCalUIDsCalendarEvnetIdsMap;
  }

  public async saveCalendarEvents(
    calendarEvents: CalendarEvent[],
    workspaceId: string,
    transactionManager?: EntityManager,
  ): Promise<void> {
    if (calendarEvents.length === 0) {
      return;
    }

    const dataSourceSchema =
      this.workspaceDataSourceService.getSchemaName(workspaceId);

    const valuesString = valuesStringForBatchRawQuery(calendarEvents, 14);

    const values = calendarEvents.flatMap((calendarEvent) => [
      calendarEvent.id,
      calendarEvent.title,
      calendarEvent.isCanceled,
      calendarEvent.isFullDay,
      calendarEvent.startsAt,
      calendarEvent.endsAt,
      calendarEvent.externalCreatedAt,
      calendarEvent.externalUpdatedAt,
      calendarEvent.description,
      calendarEvent.location,
      calendarEvent.iCalUID,
      calendarEvent.conferenceSolution,
      calendarEvent.conferenceUri,
      calendarEvent.recurringEventExternalId,
    ]);

    await this.workspaceDataSourceService.executeRawQuery(
      `INSERT INTO ${dataSourceSchema}."calendarEvent" ("id", "title", "isCanceled", "isFullDay", "startsAt", "endsAt", "externalCreatedAt", "externalUpdatedAt", "description", "location", "iCalUID", "conferenceSolution", "conferenceUri", "recurringEventExternalId") VALUES ${valuesString}`,
      values,
      workspaceId,
      transactionManager,
    );
  }

  public async updateCalendarEvents(
    calendarEvents: CalendarEvent[],
    workspaceId: string,
    transactionManager?: EntityManager,
  ): Promise<void> {
    if (calendarEvents.length === 0) {
      return;
    }

    const dataSourceSchema =
      this.workspaceDataSourceService.getSchemaName(workspaceId);

    const valuesString = valuesStringForBatchRawQuery(calendarEvents, 13, [
      'text',
      'boolean',
      'boolean',
      'timestamptz',
      'timestamptz',
      'timestamptz',
      'timestamptz',
      'text',
      'text',
      'text',
      'text',
      'text',
      'text',
    ]);

    const values = calendarEvents.flatMap((calendarEvent) => [
      calendarEvent.title,
      calendarEvent.isCanceled,
      calendarEvent.isFullDay,
      calendarEvent.startsAt,
      calendarEvent.endsAt,
      calendarEvent.externalCreatedAt,
      calendarEvent.externalUpdatedAt,
      calendarEvent.description,
      calendarEvent.location,
      calendarEvent.iCalUID,
      calendarEvent.conferenceSolution,
      calendarEvent.conferenceUri,
      calendarEvent.recurringEventExternalId,
    ]);

    await this.workspaceDataSourceService.executeRawQuery(
      `UPDATE ${dataSourceSchema}."calendarEvent" AS "calendarEvent"
      SET "title" = "newData"."title",
      "isCanceled" = "newData"."isCanceled",
      "isFullDay" = "newData"."isFullDay",
      "startsAt" = "newData"."startsAt",
      "endsAt" = "newData"."endsAt",
      "externalCreatedAt" = "newData"."externalCreatedAt",
      "externalUpdatedAt" = "newData"."externalUpdatedAt",
      "description" = "newData"."description",
      "location" = "newData"."location",
      "conferenceSolution" = "newData"."conferenceSolution",
      "conferenceUri" = "newData"."conferenceUri",
      "recurringEventExternalId" = "newData"."recurringEventExternalId"
      FROM (VALUES ${valuesString})
      AS "newData"("title", "isCanceled", "isFullDay", "startsAt", "endsAt", "externalCreatedAt", "externalUpdatedAt", "description", "location", "iCalUID", "conferenceSolution", "conferenceUri", "recurringEventExternalId")
      WHERE "calendarEvent"."iCalUID" = "newData"."iCalUID"`,
      values,
      workspaceId,
      transactionManager,
    );
  }
}
