import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { IconChevronRight, IconComponent, Pill } from 'twenty-ui';

import { Card } from '@/ui/layout/card/components/Card';
import { CardContent } from '@/ui/layout/card/components/CardContent';

type SettingsCardProps = {
  description?: string;
  disabled?: boolean;
  soon?: boolean;
  Icon: IconComponent;
  onClick?: () => void;
  title: string;
  className?: string;
  iconContainer?: boolean;
};

const StyledCard = styled(Card)<{
  disabled?: boolean;
  onClick?: () => void;
}>`
  color: ${({ disabled, theme }) =>
    disabled ? theme.font.color.extraLight : theme.font.color.tertiary};
  cursor: ${({ disabled, onClick }) =>
    disabled ? 'not-allowed' : onClick ? 'pointer' : 'default'};
  width: 100%;
  & :hover {
    background-color: ${({ theme }) => theme.background.quaternary};
  }
`;

const StyledCardContent = styled(CardContent)<object>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(2, 2)};
`;

const StyledHeader = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledTitle = styled.div<{ disabled?: boolean }>`
  color: ${({ disabled, theme }) =>
    disabled ? 'inherit' : theme.font.color.secondary};
  display: flex;
  flex: 1 0 auto;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: flex-start;
`;

const StyledIconChevronRight = styled(IconChevronRight)`
  color: ${({ theme }) => theme.font.color.light};
`;

const StyledDescription = styled.div`
  padding-left: ${({ theme }) => theme.spacing(8)};
`;

const StyledIconContainer = styled.div`
  align-items: center;
  display: flex;
  height: 24px;
  justify-content: center;
  width: 24px;
`;

export const SettingsCard = ({
  description,
  soon,
  disabled = soon,
  Icon,
  onClick,
  title,
  className,
  iconContainer = true,
}: SettingsCardProps) => {
  const theme = useTheme();

  return (
    <StyledCard
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={className}
      rounded={true}
    >
      <StyledCardContent>
        <StyledHeader>
          {iconContainer ? (
            <StyledIconContainer>
              <Icon size={theme.icon.size.lg} stroke={theme.icon.stroke.sm} />
            </StyledIconContainer>
          ) : (
            <Icon size={theme.icon.size.xl} stroke={theme.icon.stroke.sm} />
          )}
          <StyledTitle disabled={disabled}>
            {title}
            {soon && <Pill label="Soon" />}
          </StyledTitle>
          <StyledIconChevronRight size={theme.icon.size.sm} />
        </StyledHeader>
        {description && <StyledDescription>{description}</StyledDescription>}
      </StyledCardContent>
    </StyledCard>
  );
};
