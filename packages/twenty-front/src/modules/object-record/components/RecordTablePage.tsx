import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { isNonEmptyString } from '@sniptt/guards';

import { useOnboardingStatus } from '@/auth/hooks/useOnboardingStatus';
import { OnboardingStatus } from '@/auth/utils/getOnboardingStatus';
import { useObjectMetadataItemForSettings } from '@/object-metadata/hooks/useObjectMetadataItemForSettings';
import { useObjectNameSingularFromPlural } from '@/object-metadata/hooks/useObjectNameSingularFromPlural';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { RecordTableActionBar } from '@/object-record/record-table/action-bar/components/RecordTableActionBar';
import { RecordTableContextMenu } from '@/object-record/record-table/context-menu/components/RecordTableContextMenu';
import { useSelectedTableCellEditMode } from '@/object-record/record-table/record-table-cell/hooks/useSelectedTableCellEditMode';
import { DEFAULT_CELL_SCOPE } from '@/object-record/record-table/record-table-cell/hooks/useTableCell';
import { useIcons } from '@/ui/display/icon/hooks/useIcons';
import { PageAddButton } from '@/ui/layout/page/PageAddButton';
import { PageBody } from '@/ui/layout/page/PageBody';
import { PageContainer } from '@/ui/layout/page/PageContainer';
import { PageHeader } from '@/ui/layout/page/PageHeader';
import { PageHotkeysEffect } from '@/ui/layout/page/PageHotkeysEffect';
import { useSetHotkeyScope } from '@/ui/utilities/hotkey/hooks/useSetHotkeyScope';

import { RecordTableContainer } from './RecordTableContainer';

const StyledTableContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

export const RecordTablePage = () => {
  const objectNamePlural = useParams().objectNamePlural ?? '';


  const { objectNameSingular } = useObjectNameSingularFromPlural({
    objectNamePlural,
  });


  const onboardingStatus = useOnboardingStatus();

  const navigate = useNavigate();

  const { findObjectMetadataItemByNamePlural } = useObjectMetadataItemForSettings();

  const { getIcon } = useIcons();
  const Icon = getIcon(
    findObjectMetadataItemByNamePlural(objectNamePlural)?.icon,
  );

  useEffect(() => {
    if (
      !isNonEmptyString(objectNamePlural) &&
      onboardingStatus === OnboardingStatus.Completed
    ) {
      navigate('/');
    }
  }, [objectNamePlural, navigate, onboardingStatus]);

  const { createOneRecord: createOneObject } = useCreateOneRecord({
    objectNameSingular,
  });

  const recordTableId = objectNamePlural ?? '';

  const { setSelectedTableCellEditMode } = useSelectedTableCellEditMode({
    scopeId: recordTableId,
  });
  const setHotkeyScope = useSetHotkeyScope();

  const handleAddButtonClick = async () => {
    await createOneObject?.({});

    setSelectedTableCellEditMode(0, 0);
    setHotkeyScope(DEFAULT_CELL_SCOPE.scope, DEFAULT_CELL_SCOPE.customScopes);
  };

  return (
    <PageContainer>
      <PageHeader
        title={
          findObjectMetadataItemByNamePlural(objectNamePlural)?.labelPlural || ''
        }
        Icon={Icon}
      >
        <PageHotkeysEffect onAddButtonClick={handleAddButtonClick} />
        <PageAddButton onClick={handleAddButtonClick} />
      </PageHeader>
      <PageBody>
        <StyledTableContainer>
          <RecordTableContainer
            recordTableId={recordTableId}
            objectNamePlural={objectNamePlural}
            createRecord={handleAddButtonClick}
          />
        </StyledTableContainer>
        <RecordTableActionBar recordTableId={recordTableId} />
        <RecordTableContextMenu recordTableId={recordTableId} />
      </PageBody>
    </PageContainer>
  );
};
