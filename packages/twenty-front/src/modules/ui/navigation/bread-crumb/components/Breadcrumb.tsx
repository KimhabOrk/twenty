import styled from '@emotion/styled';
import { Fragment, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type BreadcrumbProps = {
  className?: string;
  links: { children: ReactNode; href?: string }[];
};

const StyledWrapper = styled.nav`
  align-items: center;
  color: ${({ theme }) => theme.font.color.secondary};
  display: flex;
  font-size: ${({ theme }) => theme.font.size.md};
  // font-weight: ${({ theme }) => theme.font.weight.semiBold};
  gap: ${({ theme }) => theme.spacing(2)};
  line-height: ${({ theme }) => theme.text.lineHeight.lg};
  white-space: nowrap;
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const StyledText = styled.span`
  color: ${({ theme }) => theme.font.color.primary};
`;

export const Breadcrumb = ({ className, links }: BreadcrumbProps) => (
  <StyledWrapper className={className}>
    {links.map((link, index) => (
      <Fragment key={index}>
        {link.href ? (
          <StyledLink to={link.href}>{link.children}</StyledLink>
        ) : (
          <StyledText>{link.children}</StyledText>
        )}
        {index < links.length - 1 && '/'}
      </Fragment>
    ))}
  </StyledWrapper>
);
