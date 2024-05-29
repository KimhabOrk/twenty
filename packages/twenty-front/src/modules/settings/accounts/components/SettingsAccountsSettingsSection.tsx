import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { H2Title, IconCalendarEvent, IconMailCog } from 'twenty-ui';

import { SettingsNavigationCard } from '@/settings/components/SettingsNavigationCard';
import { getSettingsPagePath } from '@/settings/utils/getSettingsPagePath';
import { SettingsPath } from '@/types/SettingsPath';
import { Section } from '@/ui/layout/section/components/Section';

const StyledCardsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-top: ${({ theme }) => theme.spacing(6)};
`;

export const SettingsAccountsSettingsSection = () => {
  return (
    <Section>
      <H2Title
        title="Settings"
        description="Configure your emails and calendar settings."
      />
      <StyledCardsContainer>
        <Link
          to={getSettingsPagePath(SettingsPath.AccountsEmails)}
          style={{ textDecoration: 'none' }}
        >
          <SettingsNavigationCard Icon={IconMailCog} title="Emails">
            Set email visibility, manage your blocklist and more.
          </SettingsNavigationCard>
        </Link>
        <Link to={getSettingsPagePath(SettingsPath.AccountsCalendars)}>
          <SettingsNavigationCard Icon={IconCalendarEvent} title="Calendar">
            Configure and customize your calendar preferences.
          </SettingsNavigationCard>
        </Link>
      </StyledCardsContainer>
    </Section>
  );
};
