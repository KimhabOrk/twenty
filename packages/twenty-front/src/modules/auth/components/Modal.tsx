import React from 'react';
import styled from '@emotion/styled';

import { UIModal } from '@/ui/layout/modal/components/UIModal';

const StyledContent = styled(UIModal.Content)`
  align-items: center;
  width: calc(400px - ${({ theme }) => theme.spacing(10 * 2)});
`;

type AuthModalProps = { children: React.ReactNode };

export const AuthModal = ({ children }: AuthModalProps) => (
  <UIModal isOpen={true} padding={'none'}>
    <StyledContent>{children}</StyledContent>
  </UIModal>
);
