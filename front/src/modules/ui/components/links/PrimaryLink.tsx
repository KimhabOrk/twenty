import React from 'react';
import { Link as ReactLink } from 'react-router-dom';
import styled from '@emotion/styled';

type OwnProps = {
  children: React.ReactNode;
  href: string;
  onClick?: () => void;
  fullWidth?: boolean;
};

const StyledClickable = styled.div`
  display: flex;
  a {
    color: ${({ theme }) => theme.font.color.tertiary};
    font-size: ${({ theme }) => theme.font.size.sm};
    text-decoration: none;
  }
`;

export function PrimaryLink({ href, children, onClick }: OwnProps) {
  return (
    <StyledClickable>
      <ReactLink onClick={onClick} to={href}>
        {children}
      </ReactLink>
    </StyledClickable>
  );
}
