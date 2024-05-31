import styled from '@emotion/styled';
import { isUndefined } from '@sniptt/guards';

import { useOpenCalendarEventRightDrawer } from '@/activities/calendar/right-drawer/hooks/useOpenCalendarEventRightDrawer';
import { CalendarEvent } from '@/activities/calendar/types/CalendarEvent';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';
import { useSetRecordInStore } from '@/object-record/record-store/hooks/useSetRecordInStore';
import {
  formatToHumainReadableTime,
  formatToHumanReadableDay,
  formatToHumanReadableMonth,
} from '~/utils';
import { isUndefinedOrNull } from '~/utils/isUndefinedOrNull';

const StyledEventCardCalendarEventContainer = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;
`;

const StyledCalendarEventContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: center;
`;

const StyledCalendarEventTop = styled.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  justify-content: space-between;
`;

const StyledCalendarEventTitle = styled.div`
  color: ${({ theme }) => theme.font.color.primary};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  display: flex;
`;

const StyledCalendarEventBody = styled.div`
  align-items: flex-start;
  color: ${({ theme }) => theme.font.color.tertiary};
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};

  justify-content: center;
`;

const StyledCalendarEventDateCard = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing(1)};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};

  border-radius: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
`;

const StyledCalendarEventDateCardMonth = styled.div`
  color: ${({ theme }) => theme.font.color.danger};
  font-size: ${({ theme }) => theme.font.size.xxs};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

const StyledCalendarEventDateCardDay = styled.div`
  color: ${({ theme }) => theme.font.color.primary};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

export const EventCardCalendarEvent = ({
  calendarEventId,
}: {
  calendarEventId: string;
}) => {
  const { setRecords } = useSetRecordInStore();

  const { record: calendarEvent, loading } = useFindOneRecord<CalendarEvent>({
    objectNameSingular: CoreObjectNameSingular.CalendarEvent,
    objectRecordId: calendarEventId,
    recordGqlFields: {
      id: true,
      title: true,
      startsAt: true,
      endsAt: true,
    },
    onCompleted: (data) => {
      setRecords([data]);
    },
  });

  const { openCalendarEventRightDrawer } = useOpenCalendarEventRightDrawer();

  if (loading || isUndefined(calendarEvent)) {
    return <div>Loading...</div>;
  }

  const startsAtDate = calendarEvent?.startsAt;

  if (isUndefinedOrNull(startsAtDate)) {
    throw new Error("Can't render a calendarEvent without a start date");
  }

  const startsAtMonth = formatToHumanReadableMonth(startsAtDate);

  const startsAtDay = formatToHumanReadableDay(startsAtDate);

  const startsAtHour = formatToHumainReadableTime(startsAtDate);
  const endsAtHour = calendarEvent?.endsAt
    ? formatToHumainReadableTime(startsAtDate)
    : null;

  return (
    <StyledEventCardCalendarEventContainer
      onClick={() => openCalendarEventRightDrawer(calendarEvent.id)}
    >
      <StyledCalendarEventDateCard>
        <StyledCalendarEventDateCardMonth>
          {startsAtMonth}
        </StyledCalendarEventDateCardMonth>
        <StyledCalendarEventDateCardDay>
          {startsAtDay}
        </StyledCalendarEventDateCardDay>
      </StyledCalendarEventDateCard>
      <StyledCalendarEventContent>
        <StyledCalendarEventTop>
          <StyledCalendarEventTitle>
            {calendarEvent.title}
          </StyledCalendarEventTitle>
        </StyledCalendarEventTop>
        <StyledCalendarEventBody>
          {startsAtHour} {endsAtHour && <>→ {endsAtHour}</>}
        </StyledCalendarEventBody>
      </StyledCalendarEventContent>
    </StyledEventCardCalendarEventContainer>
  );
};
