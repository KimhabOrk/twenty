import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

import { Account } from '@/accounts/types/Account';
import { IconAt, IconPlus } from '@/ui/display/icon';
import { LightIconButton } from '@/ui/input/button/components/LightIconButton';
import { Card } from '@/ui/layout/card/components/Card';
import { CardFooter } from '@/ui/layout/card/components/CardFooter';

import { SettingsAccountRow } from './SettingsAccountsRow';

const StyledFooter = styled(CardFooter)`
  align-items: center;
  color: ${({ theme }) => theme.font.color.tertiary};
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  height: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => theme.spacing(2)};
  padding-left: ${({ theme }) => theme.spacing(4)};
`;

const StyledIconButton = styled(LightIconButton)`
  margin-left: auto;
`;

type SettingsAccountsCardProps = {
  accounts: Account[];
  onAccountRemove?: (uuid: string) => void;
};

export const SettingsAccountsCard = ({
  accounts,
  onAccountRemove,
}: SettingsAccountsCardProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Card>
      {accounts.map((account, index) => (
        <SettingsAccountRow
          key={account.uuid}
          account={account}
          divider={index < accounts.length - 1}
          onRemove={onAccountRemove}
        />
      ))}
      <StyledFooter>
        <IconAt size={theme.icon.size.sm} />
        Add account
        <StyledIconButton
          Icon={IconPlus}
          accent="tertiary"
          onClick={() => navigate('/settings/accounts/new')}
        />
      </StyledFooter>
    </Card>
  );
};
