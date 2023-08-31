import React from 'react';
import styled from '@emotion/styled';

import { MOBILE_VIEWPORT } from '@/ui/theme/constants/theme';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';

import { Step, StepProps } from './Step';

const StyledContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  @media (max-width: ${MOBILE_VIEWPORT}px) {
    align-items: center;
    justify-content: center;
  }
`;

export type StepsProps = React.PropsWithChildren &
  React.ComponentProps<'div'> & {
    activeStep: number;
  };

export const StepBar = ({ children, activeStep, ...restProps }: StepsProps) => {
  const isMobile = useIsMobile();

  console.log('activeStep: ', activeStep);

  return (
    <StyledContainer {...restProps}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        // If the child is not a Step, return it as-is
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if (child.type?.displayName !== Step.displayName) {
          return child;
        }

        // We should only render the active step, and if activeStep is -1, we should only render the first step only when it's mobile device
        if (
          isMobile &&
          (activeStep === -1 ? index !== 0 : index !== activeStep)
        ) {
          return null;
        }

        return React.cloneElement<StepProps>(child as any, {
          index,
          isActive: index <= activeStep,
          isLast: index === React.Children.count(children) - 1,
        });
      })}
    </StyledContainer>
  );
};

StepBar.Step = Step;
