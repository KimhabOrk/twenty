import { useTheme } from '@emotion/react';

import { companyBoardOptions } from '@/companies/components/companyBoardOptions';
import { HooksCompanyBoard } from '@/companies/components/HooksCompanyBoard';
import { CompanyBoardContext } from '@/companies/states/CompanyBoardContext';
import { BoardActionBarButtonDeletePipelineProgress } from '@/pipeline/components/BoardActionBarButtonDeletePipelineProgress';
import { EntityBoard } from '@/pipeline/components/EntityBoard';
import { EntityBoardActionBar } from '@/pipeline/components/EntityBoardActionBar';
import { IconTargetArrow } from '@/ui/icon/index';
import { WithTopBarContainer } from '@/ui/layout/components/WithTopBarContainer';
import { RecoilScope } from '@/ui/recoil-scope/components/RecoilScope';

import { opportunitiesFilters } from './opportunities-filters';

export function Opportunities() {
  const theme = useTheme();

  return (
    <WithTopBarContainer
      title="Opportunities"
      icon={<IconTargetArrow size={theme.icon.size.md} />}
    >
      <RecoilScope SpecificContext={CompanyBoardContext}>
        <HooksCompanyBoard availableFilters={opportunitiesFilters} />
        <EntityBoard boardOptions={companyBoardOptions} />
        <EntityBoardActionBar>
          <BoardActionBarButtonDeletePipelineProgress />
        </EntityBoardActionBar>
      </RecoilScope>
    </WithTopBarContainer>
  );
}
