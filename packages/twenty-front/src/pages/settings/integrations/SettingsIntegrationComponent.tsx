import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { SoonPill } from 'tsup.ui.index';

import { IconArrowUpRight, IconBolt } from '@/ui/display/icon';

import { Integration, IntegrationType } from './constants/IntegrationTypes';
interface SettingsIntegrationComponentProps {
  integration: Integration;
}

const StyledContainer = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.font.size.md};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(3)};
`;

const StyledSection = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const StyledIntegrationLogo = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(2)};
  color: ${({ theme }) => theme.border.color.strong};
`;

const StyledButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.light};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  color: ${({ theme }) => theme.font.color.secondary};
  display: flex;
  flex-direction: row;
  font-size: ${({ theme }) => theme.font.size.md};
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  cursor: pointer;
`;

const StyledSoonPill = styled(SoonPill)`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
`;

export const SettingsIntegrationComponent = ({
  integration,
}: SettingsIntegrationComponentProps) => {
  const theme = useTheme();
  return (
    <StyledContainer>
      <StyledSection>
        <StyledIntegrationLogo>
          <img src={integration.from.image} alt={integration.from.key} />
          {integration.to ? (
            <>
              <div>→</div>
              <img src={integration.to.image} alt={integration.to.key} />
            </>
          ) : (
            <></>
          )}
        </StyledIntegrationLogo>
        {integration.text}
      </StyledSection>
      {integration.type === IntegrationType.Soon ? (
        <StyledSoonPill />
      ) : (
        <StyledButton>
          {integration.type === IntegrationType.Use ? (
            <IconBolt size={theme.icon.size.md} />
          ) : (
            <IconArrowUpRight size={theme.icon.size.md} />
          )}
          {integration.type === IntegrationType.Goto ? (
            <div>{integration.linkText}</div>
          ) : (
            <div>Use</div>
          )}
        </StyledButton>
      )}
    </StyledContainer>
  );
};
