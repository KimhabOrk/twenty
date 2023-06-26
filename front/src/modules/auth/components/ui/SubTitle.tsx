import React from 'react';
import styled from '@emotion/styled';

type OwnProps = {
  children: React.ReactNode;
};

const StyledSubTitle = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export function SubTitle({ children }: OwnProps): JSX.Element {
  return <StyledSubTitle>{children}</StyledSubTitle>;
}
