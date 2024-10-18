import { Calendar } from '@/activities/calendar/components/Calendar';
import { EmailThreads } from '@/activities/emails/components/EmailThreads';
import { Attachments } from '@/activities/files/components/Attachments';
import { Notes } from '@/activities/notes/components/Notes';
import { ObjectTasks } from '@/activities/tasks/components/ObjectTasks';
import { TimelineActivities } from '@/activities/timelineActivities/components/TimelineActivities';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useDeleteOneRecord } from '@/object-record/hooks/useDeleteOneRecord';
import { isNewViewableRecordLoadingState } from '@/object-record/record-right-drawer/states/isNewViewableRecordLoading';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import { Button } from '@/ui/input/button/components/Button';
import { ShowPageActivityContainer } from '@/ui/layout/show-page/components/ShowPageActivityContainer';
import { ShowPageLeftContainer } from '@/ui/layout/show-page/components/ShowPageLeftContainer';
import { SingleTabProps, TabList } from '@/ui/layout/tab/components/TabList';
import { useTabList } from '@/ui/layout/tab/hooks/useTabList';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { WorkflowVersionVisualizer } from '@/workflow/components/WorkflowVersionVisualizer';
import { WorkflowVersionVisualizerEffect } from '@/workflow/components/WorkflowVersionVisualizerEffect';
import { WorkflowVisualizer } from '@/workflow/components/WorkflowVisualizer';
import { WorkflowVisualizerEffect } from '@/workflow/components/WorkflowVisualizerEffect';
import styled from '@emotion/styled';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IconTrash } from 'twenty-ui';

const StyledShowPageRightContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: start;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const StyledTabListContainer = styled.div`
  align-items: center;
  border-bottom: ${({ theme }) => `1px solid ${theme.border.color.light}`};
  box-sizing: border-box;
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  height: 40px;
`;

const StyledGreyBox = styled.div<{ isInRightDrawer: boolean }>`
  background: ${({ theme, isInRightDrawer }) =>
    isInRightDrawer ? theme.background.secondary : ''};
  border: ${({ isInRightDrawer, theme }) =>
    isInRightDrawer ? `1px solid ${theme.border.color.medium}` : ''};
  border-radius: ${({ isInRightDrawer, theme }) =>
    isInRightDrawer ? theme.border.radius.md : ''};
  height: ${({ isInRightDrawer }) => (isInRightDrawer ? 'auto' : '100%')};

  margin: ${({ isInRightDrawer, theme }) =>
    isInRightDrawer ? theme.spacing(4) : ''};
`;

const StyledButtonContainer = styled.div`
  align-items: center;
  bottom: 0;
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
  display: flex;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing(2)};
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  width: 100%;
`;

const StyledContentContainer = styled.div<{ isInRightDrawer: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding-bottom: ${({ theme, isInRightDrawer }) =>
    isInRightDrawer ? theme.spacing(16) : 0};
`;

export const TAB_LIST_COMPONENT_ID = 'show-page-right-tab-list';

type ShowPageSubContainerProps = {
  tabs: SingleTabProps[];
  targetableObject: Pick<
    ActivityTargetableObject,
    'targetObjectNameSingular' | 'id'
  >;
  fieldsCard?: JSX.Element;
  summaryCard?: JSX.Element;
  isInRightDrawer?: boolean;
  loading: boolean;
};

export const ShowPageSubContainer = ({
  tabs,
  targetableObject,
  loading,
  fieldsCard,
  summaryCard,
  isInRightDrawer = false,
}: ShowPageSubContainerProps) => {
  const { activeTabIdState } = useTabList(
    `${TAB_LIST_COMPONENT_ID}-${isInRightDrawer}`,
  );
  const activeTabId = useRecoilValue(activeTabIdState);

  const isMobile = useIsMobile();

  const isNewViewableRecordLoading = useRecoilValue(
    isNewViewableRecordLoadingState,
  );

  const renderActiveTabContent = () => {
    switch (activeTabId) {
      case 'timeline':
        return (
          <>
            <TimelineActivities
              targetableObject={targetableObject}
              isInRightDrawer={isInRightDrawer}
            />
          </>
        );
      case 'richText':
        return (
          (targetableObject.targetObjectNameSingular ===
            CoreObjectNameSingular.Note ||
            targetableObject.targetObjectNameSingular ===
              CoreObjectNameSingular.Task) && (
            <ShowPageActivityContainer targetableObject={targetableObject} />
          )
        );
      case 'fields':
        return (
          <StyledGreyBox isInRightDrawer={isInRightDrawer}>
            {fieldsCard}
          </StyledGreyBox>
        );
      case 'tasks':
        return <ObjectTasks targetableObject={targetableObject} />;
      case 'notes':
        return <Notes targetableObject={targetableObject} />;
      case 'files':
        return <Attachments targetableObject={targetableObject} />;
      case 'emails':
        return <EmailThreads targetableObject={targetableObject} />;
      case 'calendar':
        return <Calendar targetableObject={targetableObject} />;
      case 'workflow':
        return (
          <>
            <WorkflowVisualizerEffect workflowId={targetableObject.id} />

            <WorkflowVisualizer targetableObject={targetableObject} />
          </>
        );
      case 'workflowVersion':
        return (
          <>
            <WorkflowVersionVisualizerEffect
              workflowVersionId={targetableObject.id}
            />

            <WorkflowVersionVisualizer
              workflowVersionId={targetableObject.id}
            />
          </>
        );
      default:
        return <></>;
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteOneRecord } = useDeleteOneRecord({
    objectNameSingular: targetableObject.targetObjectNameSingular,
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteOneRecord(targetableObject.id);
    setIsDeleting(false);
  };

  const [recordFromStore] = useRecoilState<ObjectRecord | null>(
    recordStoreFamilyState(targetableObject.id),
  );

  return (
    <>
      {!isMobile && !isInRightDrawer && (
        <ShowPageLeftContainer forceMobile={isMobile}>
          {summaryCard}
          {fieldsCard}
        </ShowPageLeftContainer>
      )}
      <StyledShowPageRightContainer isMobile={isMobile}>
        <StyledTabListContainer>
          <TabList
            loading={loading || isNewViewableRecordLoading}
            tabListId={`${TAB_LIST_COMPONENT_ID}-${isInRightDrawer}`}
            tabs={tabs}
          />
        </StyledTabListContainer>
        {(isMobile || isInRightDrawer) && summaryCard}
        <StyledContentContainer isInRightDrawer={isInRightDrawer}>
          {renderActiveTabContent()}
        </StyledContentContainer>
        {isInRightDrawer && recordFromStore && !recordFromStore.deletedAt && (
          <StyledButtonContainer>
            <Button
              Icon={IconTrash}
              onClick={handleDelete}
              disabled={isDeleting}
              title={isDeleting ? 'Deleting...' : 'Delete'}
            ></Button>
          </StyledButtonContainer>
        )}
      </StyledShowPageRightContainer>
    </>
  );
};
