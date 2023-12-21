import styled from '@emotion/styled';

import { CardContent } from '@/ui/layout/card/components/CardContent';
import { Avatar } from '@/users/components/Avatar';
import { TimelineThread } from '~/generated/graphql';
import { formatToHumanReadableDate } from '~/utils';

const StyledCardContent = styled(CardContent)`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  height: ${({ theme }) => theme.spacing(12)};
  padding: ${({ theme }) => theme.spacing(0, 4)};
`;

const StyledHeading = styled.div<{ unread: boolean }>`
  align-items: center;
  color: ${({ theme, unread }) =>
    unread ? theme.font.color.primary : theme.font.color.secondary};
  display: flex;
  font-weight: ${({ theme, unread }) =>
    unread ? theme.font.weight.medium : theme.font.weight.regular};
  gap: ${({ theme }) => theme.spacing(1)};
  overflow: hidden;
  width: 160px;

  :before {
    background-color: ${({ theme, unread }) =>
      unread ? theme.color.blue : 'transparent'};
    border-radius: ${({ theme }) => theme.border.radius.rounded};
    content: '';
    display: block;
    height: 6px;
    width: 6px;
  }
`;

const StyledAvatar = styled(Avatar)`
  margin: ${({ theme }) => theme.spacing(0, 1)};
`;

const StyledSenderName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledThreadCount = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
`;

const StyledSubject = styled.span<{ unread: boolean }>`
  color: ${({ theme, unread }) =>
    unread ? theme.font.color.primary : theme.font.color.secondary};
  white-space: nowrap;
`;

const StyledBody = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledSubjectAndBody = styled.div`
  display: flex;
  flex: 1;
  gap: ${({ theme }) => theme.spacing(2)};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledReceivedAt = styled.div`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  padding: ${({ theme }) => theme.spacing(0, 1)};
`;

type EmailPreviewProps = {
  divider?: boolean;
  email: TimelineThread;
};

export const EmailPreview = ({ divider, email }: EmailPreviewProps) => (
  <StyledCardContent divider={divider}>
    <StyledHeading unread={!email.read}>
      <StyledAvatar
        avatarUrl={email.senderPictureUrl}
        placeholder={email.senderName}
        type="rounded"
      />
      <StyledSenderName>{email.senderName}</StyledSenderName>
      <StyledThreadCount>{email.numberOfMessagesInThread}</StyledThreadCount>
    </StyledHeading>

    <StyledSubjectAndBody>
      <StyledSubject unread={!email.read}>{email.subject}</StyledSubject>
      <StyledBody>{email.body}</StyledBody>
    </StyledSubjectAndBody>
    <StyledReceivedAt>
      {formatToHumanReadableDate(email.receivedAt)}
    </StyledReceivedAt>
  </StyledCardContent>
);
