import { ComponentPropsWithoutRef, ReactNode, useMemo } from 'react';
import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { isUndefined } from '@sniptt/guards';
import {
  IconAlertTriangle,
  IconInfoCircle,
  IconSquareRoundedCheck,
  IconX,
} from 'twenty-ui';

import { ProgressBar } from '@/ui/feedback/progress-bar/components/ProgressBar';
import { useProgressAnimation } from '@/ui/feedback/progress-bar/hooks/useProgressAnimation';
import { LightButton } from '@/ui/input/button/components/LightButton';
import { LightIconButton } from '@/ui/input/button/components/LightIconButton';
import { isDefined } from '~/utils/isDefined';

export enum SnackBarVariant {
  Default = 'default',
  Error = 'error',
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
}

export type SnackBarProps = Pick<
  ComponentPropsWithoutRef<'div'>,
  'id' | 'title'
> & {
  children?: ReactNode;
  className?: string;
  progress?: number;
  duration?: number;
  icon?: ReactNode;
  message?: string;
  onCancel?: () => void;
  onClose?: () => void;
  role?: 'alert' | 'status';
  variant?: SnackBarVariant;
};

const StyledContainer = styled.div`
  backdrop-filter: ${({ theme }) => theme.blur.light};
  background-color: ${({ theme }) => theme.background.transparent.primary};
  border-radius: ${({ theme }) => theme.border.radius.md};
  box-shadow: ${({ theme }) => theme.boxShadow.strong};
  box-sizing: border-box;
  cursor: pointer;
  height: 61px;
  padding: ${({ theme }) => theme.spacing(2)};
  position: relative;
  width: 296px;
`;

const StyledProgressBar = styled(ProgressBar)`
  bottom: 0;
  height: auto;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  pointer-events: none;
`;

const StyledHeader = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.font.color.primary};
  display: flex;
  font-weight: ${({ theme }) => theme.font.weight.medium};
  gap: ${({ theme }) => theme.spacing(2)};
  height: ${({ theme }) => theme.spacing(6)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledActions = styled.div`
  align-items: center;
  display: flex;
  margin-left: auto;
`;

const StyledDescription = styled.div`
  color: ${({ theme }) => theme.font.color.tertiary};
  font-size: ${({ theme }) => theme.font.size.sm};
  padding-left: ${({ theme }) => theme.spacing(6)};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 200px;
`;

export const SnackBar = ({
  children,
  className,
  progress: overrideProgressValue,
  duration = 6000,
  icon: iconComponent,
  id,
  message,
  onCancel,
  onClose,
  role = 'status',
  title,
  variant = SnackBarVariant.Default,
}: SnackBarProps) => {
  const theme = useTheme();
  const { animation: progressAnimation, value: progressValue } =
    useProgressAnimation({
      autoPlay: isUndefined(overrideProgressValue),
      initialValue: isDefined(overrideProgressValue)
        ? overrideProgressValue
        : 100,
      finalValue: 0,
      options: { duration, onComplete: onClose },
    });

  const icon = useMemo(() => {
    if (isDefined(iconComponent)) {
      return iconComponent;
    }

    const color = theme.snackBar[variant].color;
    const size = theme.icon.size.md;

    switch (variant) {
      case SnackBarVariant.Error:
        return <IconAlertTriangle aria-label="Error" {...{ color, size }} />;
      case SnackBarVariant.Info:
        return <IconInfoCircle aria-label="Info" {...{ color, size }} />;
      case SnackBarVariant.Success:
        return (
          <IconSquareRoundedCheck aria-label="Success" {...{ color, size }} />
        );
      case SnackBarVariant.Warning:
        return <IconAlertTriangle aria-label="Warning" {...{ color, size }} />;
      default:
        return <IconAlertTriangle aria-label="Alert" {...{ color, size }} />;
    }
  }, [iconComponent, theme.icon.size.md, theme.snackBar, variant]);

  const handleMouseEnter = () => {
    if (progressAnimation?.state === 'running') {
      progressAnimation.pause();
    }
  };

  const handleMouseLeave = () => {
    if (progressAnimation?.state === 'paused') {
      progressAnimation.play();
    }
  };

  return (
    <StyledContainer
      aria-live={role === 'alert' ? 'assertive' : 'polite'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...{ className, id, role, title, variant }}
    >
      <StyledProgressBar
        color={theme.snackBar[variant].backgroundColor}
        value={progressValue}
      />
      <StyledHeader>
        {icon}
        {title}
        <StyledActions>
          {!!onCancel && <LightButton title="Cancel" onClick={onCancel} />}
          {!!onClose && (
            <LightIconButton title="Close" Icon={IconX} onClick={onClose} />
          )}
        </StyledActions>
      </StyledHeader>
      <StyledDescription>{children || message}</StyledDescription>
    </StyledContainer>
  );
};
