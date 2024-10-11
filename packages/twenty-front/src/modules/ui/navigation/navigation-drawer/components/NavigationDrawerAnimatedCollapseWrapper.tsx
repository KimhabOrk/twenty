import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { isNavigationDrawerExpandedState } from '@/ui/navigation/states/isNavigationDrawerExpanded';
import { useTheme } from '@emotion/react';
import { useIsSettingsPage } from '@/navigation/hooks/useIsSettingsPage';

const StyledAnimatedContainer = styled(motion.div)``;

export const NavigationDrawerAnimatedCollapseWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  const isSettingsPage = useIsSettingsPage();
  const isNavigationDrawerExpanded = useRecoilValue(
    isNavigationDrawerExpandedState,
  );

  if (isSettingsPage) {
    return children;
  }

  return (
    <StyledAnimatedContainer
      animate={
        isNavigationDrawerExpanded
          ? { opacity: 1, height: 'auto', width: 'auto' }
          : { opacity: 0, height: 0, width: 0 }
      }
      transition={{
        duration: theme.animation.duration.normal + 2,
      }}
    >
      {children}
    </StyledAnimatedContainer>
  );
};
