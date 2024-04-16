'use client';
import styled from '@emotion/styled';

import mq from '@/app/_components/ui/theme/mq';
import { Theme } from '@/app/_components/ui/theme/theme';
import UserGuideCard from '@/app/_components/user-guide/UserGuideCard';
import { USER_GUIDE_HOME_CARDS } from '@/content/user-guide/constants/UserGuideHomeCards';

const StyledContainer = styled.div`
  ${mq({
    width: ['100%', '60%', '60%'],
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  })};
`;

const StyledWrapper = styled.div`
  padding: ${Theme.spacing(10)} 92px ${Theme.spacing(20)};
  display: flex;
  flex-direction: column;
  gap: ${Theme.spacing(8)};
  width: 100%;

  @media (max-width: 800px) {
    padding: ${Theme.spacing(10)} 24px ${Theme.spacing(20)};
  }
`;

const StyledTitle = styled.div`
  font-size: ${Theme.font.size.sm};
  color: ${Theme.text.color.quarternary};
  font-weight: ${Theme.font.weight.medium};
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

const StyledHeading = styled.h1`
  line-height: 38px;
  font-weight: 700;
  font-size: 38px;
  color: ${Theme.text.color.primary};
  margin: 0px;
`;

const StyledSubHeading = styled.h1`
  line-height: 28.8px;
  font-size: ${Theme.font.size.sm};
  font-weight: ${Theme.font.weight.regular};
  color: ${Theme.text.color.tertiary};
`;

const StyledContent = styled.div`
  ${mq({
    width: '100%',
    paddingTop: `${Theme.spacing(6)}`,
    display: ['flex', 'flex', 'grid'],
    flexDirection: 'column',
    gridTemplateRows: 'auto auto',
    gridTemplateColumns: 'auto auto',
    gap: `${Theme.spacing(6)}`,
  })};
  @media (max-width: 810px) {
    align-items: center;
  }
  @media (min-width: 1200px) {
    justify-content: left;
  }
`;

export default function UserGuideMain() {
  return (
    <StyledContainer>
      <StyledWrapper>
        <StyledTitle>User Guide</StyledTitle>
        <StyledHeader>
          <StyledHeading>User Guide</StyledHeading>
          <StyledSubHeading>
            A brief guide to grasp the basics of Twenty
          </StyledSubHeading>
        </StyledHeader>
        <StyledContent>
          {USER_GUIDE_HOME_CARDS.map((card) => {
            return <UserGuideCard key={card.title} card={card} />;
          })}
        </StyledContent>
      </StyledWrapper>
    </StyledContainer>
  );
}
