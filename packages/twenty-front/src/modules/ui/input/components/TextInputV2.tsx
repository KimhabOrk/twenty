import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import React, {
  ChangeEvent,
  FocusEventHandler,
  ForwardedRef,
  InputHTMLAttributes,
  forwardRef,
  useId,
  useRef,
  useState,
} from 'react';
import { IconComponent, IconEye, IconEyeOff } from 'twenty-ui';
import { useCombinedRefs } from '~/hooks/useCombinedRefs';
import { turnIntoEmptyStringIfWhitespacesOnly } from '~/utils/string/turnIntoEmptyStringIfWhitespacesOnly';

const StyledContainer = styled.div<
  Pick<TextInputV2ComponentProps, 'fullWidth'>
>`
  display: inline-flex;
  flex-direction: column;
  width: ${({ fullWidth }) => (fullWidth ? `100%` : 'auto')};
`;

const StyledLabel = styled.label`
  color: ${({ theme }) => theme.font.color.light};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const StyledRightComponentContainer = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.background.transparent.lighter};
  border-top: 1px solid ${({ theme }) => theme.border.color.medium};
  border-left: 1px solid ${({ theme }) => theme.border.color.medium};
  border-bottom: 1px solid ${({ theme }) => theme.border.color.medium};
  justify-content: center;
  display: flex;
`;

const StyledInput = styled.input<
  Pick<TextInputV2ComponentProps, 'fullWidth' | 'LeftIcon' | 'error'>
>`
  background-color: ${({ theme }) => theme.background.transparent.lighter};
  border: 1px solid
    ${({ theme, error }) =>
      error ? theme.border.color.danger : theme.border.color.medium};
  border-bottom-left-radius: ${({ theme, LeftIcon }) =>
    !LeftIcon && theme.border.radius.sm};
  border-right: none;
  border-left: ${({ LeftIcon }) => LeftIcon && 'none'};
  border-top-left-radius: ${({ theme, LeftIcon }) =>
    !LeftIcon && theme.border.radius.sm};
  box-sizing: border-box;
  color: ${({ theme }) => theme.font.color.primary};
  display: flex;
  flex-grow: 1;
  font-family: ${({ theme }) => theme.font.family};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  height: 32px;
  outline: none;
  padding: ${({ theme }) => theme.spacing(2)};
  width: 100%;

  &::placeholder,
  &::-webkit-input-placeholder {
    color: ${({ theme }) => theme.font.color.light};
    font-family: ${({ theme }) => theme.font.family};
    font-weight: ${({ theme }) => theme.font.weight.medium};
  }

  &:disabled {
    color: ${({ theme }) => theme.font.color.tertiary};
  }
`;

const StyledErrorHelper = styled.div`
  color: ${({ theme }) => theme.color.red};
  font-size: ${({ theme }) => theme.font.size.xs};
  padding: ${({ theme }) => theme.spacing(1)};
`;

const StyledLeftIconContainer = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.background.transparent.lighter};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-bottom-left-radius: ${({ theme }) => theme.border.radius.sm};
  border-right: none;
  border-top-left-radius: ${({ theme }) => theme.border.radius.sm};
  display: flex;
  justify-content: center;
  padding-left: ${({ theme }) => theme.spacing(2)};
`;

const StyledTrailingIconContainer = styled.div<
  Pick<TextInputV2ComponentProps, 'error'>
>`
  align-items: center;
  background-color: ${({ theme }) => theme.background.transparent.lighter};
  border: 1px solid
    ${({ theme, error }) =>
      error ? theme.border.color.danger : theme.border.color.medium};
  border-bottom-right-radius: ${({ theme }) => theme.border.radius.sm};
  border-left: none;
  border-top-right-radius: ${({ theme }) => theme.border.radius.sm};
  display: flex;
  justify-content: center;
  padding-right: ${({ theme }) => theme.spacing(1)};
`;

const StyledTrailingIcon = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.font.color.light};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  display: flex;
  justify-content: center;
`;

const INPUT_TYPE_PASSWORD = 'password';

export type TextInputV2ComponentProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'onKeyDown'
> & {
  className?: string;
  label?: string;
  onChange?: (text: string) => void;
  fullWidth?: boolean;
  error?: string;
  noErrorHelper?: boolean;
  RightIcon?: IconComponent;
  LeftIcon?: IconComponent;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  dataTestId?: string;
  RightComponent?: React.ReactNode;
};

const TextInputV2Component = (
  {
    className,
    label,
    value,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    fullWidth,
    error,
    noErrorHelper = false,
    required,
    type,
    autoFocus,
    placeholder,
    disabled,
    tabIndex,
    RightIcon,
    LeftIcon,
    autoComplete,
    maxLength,
    dataTestId,
    RightComponent,
  }: TextInputV2ComponentProps,
  // eslint-disable-next-line @nx/workspace-component-props-naming
  ref: ForwardedRef<HTMLInputElement>,
): JSX.Element => {
  const theme = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);
  const combinedRef = useCombinedRefs(ref, inputRef);

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const inputId = useId();

  return (
    <StyledContainer className={className} fullWidth={fullWidth ?? false}>
      {label && (
        <StyledLabel htmlFor={inputId}>
          {label + (required ? '*' : '')}
        </StyledLabel>
      )}
      <StyledInputContainer>
        {!!LeftIcon && (
          <StyledLeftIconContainer>
            <StyledTrailingIcon>
              <LeftIcon size={theme.icon.size.md} />
            </StyledTrailingIcon>
          </StyledLeftIconContainer>
        )}
        <StyledInput
          id={inputId}
          data-testid={dataTestId}
          autoComplete={autoComplete || 'off'}
          ref={combinedRef}
          tabIndex={tabIndex ?? 0}
          onFocus={onFocus}
          onBlur={onBlur}
          type={passwordVisible ? 'text' : type}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onChange?.(
              turnIntoEmptyStringIfWhitespacesOnly(event.target.value),
            );
          }}
          onKeyDown={onKeyDown}
          {...{
            autoFocus,
            disabled,
            placeholder,
            required,
            value,
            LeftIcon,
            maxLength,
            error,
          }}
        />
        {!!RightComponent && (
          <StyledRightComponentContainer>
            {RightComponent}
          </StyledRightComponentContainer>
        )}
        <StyledTrailingIconContainer {...{ error }}>
          {!error && type === INPUT_TYPE_PASSWORD && (
            <StyledTrailingIcon
              onClick={handleTogglePasswordVisibility}
              data-testid="reveal-password-button"
            >
              {passwordVisible ? (
                <IconEyeOff size={theme.icon.size.md} />
              ) : (
                <IconEye size={theme.icon.size.md} />
              )}
            </StyledTrailingIcon>
          )}
          {!error && type !== INPUT_TYPE_PASSWORD && !!RightIcon && (
            <StyledTrailingIcon>
              <RightIcon size={theme.icon.size.md} />
            </StyledTrailingIcon>
          )}
        </StyledTrailingIconContainer>
      </StyledInputContainer>
      {error && !noErrorHelper && (
        <StyledErrorHelper>{error}</StyledErrorHelper>
      )}
    </StyledContainer>
  );
};

export const TextInputV2 = forwardRef(TextInputV2Component);
