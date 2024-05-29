import React from 'react';
import { css, useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { IconComponent, Pill } from 'twenty-ui';

export type ButtonSize = 'medium' | 'small';
export type ButtonPosition = 'standalone' | 'left' | 'middle' | 'right';
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonAccent = 'default' | 'blue' | 'danger';

export type ButtonProps = {
  className?: string;
  Icon?: IconComponent;
  title?: string;
  fullWidth?: boolean;
  variant?: ButtonVariant;
  inverted?: boolean;
  size?: ButtonSize;
  position?: ButtonPosition;
  accent?: ButtonAccent;
  soon?: boolean;
  justify?: 'center' | 'flex-start' | 'flex-end';
  disabled?: boolean;
  focus?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
} & React.ComponentProps<'button'>;

const StyledButton = styled.button<
  Pick<
    ButtonProps,
    | 'fullWidth'
    | 'variant'
    | 'inverted'
    | 'size'
    | 'position'
    | 'accent'
    | 'focus'
    | 'justify'
  >
>`
  align-items: center;
  ${({ theme, variant, inverted, accent, disabled, focus }) => {
    switch (variant) {
      case 'primary':
        switch (accent) {
          case 'default':
            return css`
              background: ${!inverted
                ? theme.background.secondary
                : theme.background.primary};
              border-color: ${!inverted
                ? focus
                  ? theme.color.blue
                  : theme.background.transparent.light
                : theme.background.transparent.light};
              border-width: 1px 1px 1px 1px !important;
              opacity: ${disabled ? 0.24 : 1};
              box-shadow: ${!disabled && focus
                ? `0 0 0 3px ${
                    !inverted ? theme.accent.tertiary : `${theme.color.blue}1A`
                  }`
                : 'none'};
              color: ${!inverted
                ? !disabled
                  ? theme.font.color.secondary
                  : theme.font.color.extraLight
                : theme.font.color.secondary};
              &:hover {
                background: ${!inverted
                  ? theme.background.tertiary
                  : theme.background.secondary};
              }
              &:active {
                background: ${!inverted
                  ? theme.background.quaternary
                  : theme.background.tertiary};
              }
            `;
          case 'blue':
            return css`
              background: ${!inverted
                ? theme.color.blue
                : theme.background.primary};
              border-color: ${!inverted
                ? focus
                  ? theme.color.blue
                  : theme.background.transparent.light
                : theme.background.transparent.light};
              border-width: 1px 1px 1px 1px !important;
              box-shadow: ${!disabled && focus
                ? `0 0 0 3px ${
                    !inverted ? theme.accent.tertiary : `${theme.color.blue}1A`
                  }`
                : 'none'};
              color: ${!inverted ? theme.grayScale.gray0 : theme.color.blue};
              opacity: ${disabled ? 0.24 : 1};
              ${disabled
                ? ''
                : css`
                    &:hover {
                      background: ${!inverted
                        ? theme.color.blue50
                        : theme.background.secondary};
                    }
                    &:active {
                      background: ${!inverted
                        ? theme.color.blue60
                        : theme.background.tertiary};
                    }
                  `}
            `;
          case 'danger':
            return css`
              background: ${!inverted
                ? theme.color.red
                : theme.background.primary};
              border-color: ${!inverted
                ? focus
                  ? theme.color.red
                  : theme.background.transparent.light
                : theme.background.transparent.light};
              border-width: 1px 1px !important;
              box-shadow: ${!disabled && focus
                ? `0 0 0 3px ${
                    !inverted ? theme.color.red10 : `${theme.color.blue}1A`
                  }`
                : 'none'};
              color: ${!inverted ? theme.background.primary : theme.color.red};
              opacity: ${disabled ? 0.24 : 1};
              ${disabled
                ? ''
                : css`
                    &:hover {
                      background: ${!inverted
                        ? theme.color.red40
                        : theme.background.secondary};
                    }
                    &:active {
                      background: ${!inverted
                        ? theme.color.red50
                        : theme.background.tertiary};
                    }
                  `}
            `;
        }
        break;
      case 'secondary':
      case 'tertiary':
        switch (accent) {
          case 'default':
            return css`
              background: ${focus
                ? theme.background.transparent.primary
                : 'transparent'};
              border-color: ${variant === 'secondary'
                ? !disabled && focus
                  ? theme.color.blue
                  : theme.background.transparent.medium
                : focus
                  ? theme.color.blue
                  : 'transparent'};
              border-width: ${!disabled && focus ? '1px 1px !important' : 0};
              box-shadow: ${!disabled && focus
                ? `0 0 0 3px ${theme.accent.tertiary}`
                : 'none'};
              color: ${!disabled
                ? theme.font.color.secondary
                : theme.font.color.extraLight};
              &:hover {
                background: ${!disabled
                  ? theme.background.transparent.light
                  : 'transparent'};
              }
              &:active {
                background: ${!disabled
                  ? theme.background.transparent.light
                  : 'transparent'};
              }
            `;
          case 'blue':
            return css`
              background: ${focus
                ? theme.background.transparent.primary
                : 'transparent'};
              border-color: ${variant === 'secondary'
                ? focus
                  ? theme.color.blue
                  : theme.color.blue20
                : focus
                  ? theme.color.blue
                  : 'transparent'};
              border-width: ${!disabled && focus ? '1px 1px !important' : 0};
              box-shadow: ${!disabled && focus
                ? `0 0 0 3px ${theme.accent.tertiary}`
                : 'none'};
              color: ${!disabled ? theme.color.blue : theme.accent.accent4060};
              &:hover {
                background: ${!disabled
                  ? theme.accent.tertiary
                  : 'transparent'};
              }
              &:active {
                background: ${!disabled
                  ? theme.accent.secondary
                  : 'transparent'};
              }
            `;
          case 'danger':
            return css`
              border-color: ${variant === 'secondary'
                ? focus
                  ? theme.color.red
                  : theme.border.color.danger
                : focus
                  ? theme.color.red
                  : 'transparent'};
              border-width: ${!disabled && focus ? '1px 1px !important' : 0};
              box-shadow: ${!disabled && focus
                ? `0 0 0 3px ${theme.color.red10}`
                : 'none'};
              color: ${!disabled ? theme.font.color.danger : theme.color.red20};
              &:hover {
                background: ${!disabled
                  ? theme.background.danger
                  : 'transparent'};
              }
              &:active {
                background: ${!disabled
                  ? theme.background.danger
                  : 'transparent'};
              }
            `;
        }
    }
  }}

  border-radius: ${({ position, theme }) => {
    switch (position) {
      case 'left':
        return `${theme.border.radius.sm} 0px 0px ${theme.border.radius.sm}`;
      case 'right':
        return `0px ${theme.border.radius.sm} ${theme.border.radius.sm} 0px`;
      case 'middle':
        return '0px';
      case 'standalone':
        return theme.border.radius.sm;
    }
  }};
  border-style: solid;
  border-width: ${({ variant, position }) => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return position === 'middle' ? '1px 0px' : '1px';
      case 'tertiary':
        return '0';
    }
  }};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  flex-direction: row;
  font-family: ${({ theme }) => theme.font.family};
  font-weight: 500;
  gap: ${({ theme }) => theme.spacing(1)};
  height: ${({ size }) => (size === 'small' ? '24px' : '32px')};
  justify-content: ${({ justify }) => justify};
  padding: ${({ theme }) => {
    return `0 ${theme.spacing(2)}`;
  }};

  transition: background 0.1s ease;

  white-space: nowrap;

  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  &:focus {
    outline: none;
  }
`;

const StyledSoonPill = styled(Pill)`
  margin-left: auto;
`;

export const Button = ({
  className,
  Icon,
  title,
  fullWidth = false,
  variant = 'primary',
  inverted = false,
  size = 'medium',
  accent = 'default',
  position = 'standalone',
  soon = false,
  disabled = false,
  justify = 'flex-start',
  focus = false,
  onClick,
}: ButtonProps) => {
  const theme = useTheme();

  return (
    <StyledButton
      fullWidth={fullWidth}
      variant={variant}
      inverted={inverted}
      size={size}
      position={position}
      disabled={soon || disabled}
      focus={focus}
      justify={justify}
      accent={accent}
      className={className}
      onClick={onClick}
    >
      {Icon && <Icon size={theme.icon.size.sm} />}
      {title}
      {soon && <StyledSoonPill label="Soon" />}
    </StyledButton>
  );
};
