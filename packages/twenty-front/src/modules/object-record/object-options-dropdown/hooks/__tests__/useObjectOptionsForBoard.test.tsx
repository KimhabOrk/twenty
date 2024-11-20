import { useObjectOptionsForBoard } from '@/object-record/object-options-dropdown/hooks/useObjectOptionsForBoard';
import { isRecordBoardCompactModeActiveComponentState } from '@/object-record/record-board/states/isRecordBoardCompactModeActiveComponentState';
import { recordIndexFieldDefinitionsState } from '@/object-record/record-index/states/recordIndexFieldDefinitionsState';
import { extractComponentState } from '@/ui/utilities/state/component-state/utils/extractComponentState';
import { DropResult, ResponderProvided } from '@hello-pangea/dnd';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { RecoilRoot } from 'recoil';

jest.mock('@/views/hooks/useSaveCurrentViewFields', () => ({
  useSaveCurrentViewFields: jest.fn(() => ({
    saveViewFields: jest.fn(),
  })),
}));

jest.mock('@/views/hooks/useUpdateCurrentView', () => ({
  useUpdateCurrentView: jest.fn(() => ({
    updateCurrentView: jest.fn(),
  })),
}));

jest.mock('@/object-metadata/hooks/useObjectMetadataItem', () => ({
  useObjectMetadataItem: jest.fn(() => ({
    objectMetadataItem: {
      fields: [
        {
          id: 'field1',
          name: 'field1',
          label: 'Field 1',
          isVisible: true,
          position: 0,
        },
        {
          id: 'field2',
          name: 'field2',
          label: 'Field 2',
          isVisible: true,
          position: 1,
        },
      ],
    },
  })),
}));

jest.mock('@/object-record/record-board/hooks/useRecordBoard', () => ({
  useRecordBoard: jest.fn(() => ({
    isCompactModeActiveState: { key: 'isCompactModeActiveState' },
  })),
}));

describe('useObjectOptionsForBoard', () => {
  const initialRecoilState = [
    { fieldMetadataId: 'field1', isVisible: true, position: 0 },
    { fieldMetadataId: 'field2', isVisible: true, position: 1 },
  ];

  const renderWithRecoil = () =>
    renderHook(
      () =>
        useObjectOptionsForBoard({
          objectNameSingular: 'object',
          recordBoardId: 'boardId',
          viewBarId: 'viewBarId',
        }),
      {
        wrapper: ({ children }) => (
          <RecoilRoot
            initializeState={({ set }) => {
              set(recordIndexFieldDefinitionsState, initialRecoilState as any);
              set(
                extractComponentState(
                  isRecordBoardCompactModeActiveComponentState,
                  'scope-id',
                ),
                false,
              );
            }}
          >
            {children}
          </RecoilRoot>
        ),
      },
    );

  it('reorders fields correctly', () => {
    const { result } = renderWithRecoil();

    const dropResult: DropResult = {
      source: { droppableId: 'droppable', index: 0 },
      destination: { droppableId: 'droppable', index: 1 },
      draggableId: 'field1',
      type: 'TYPE',
      mode: 'FLUID',
      reason: 'DROP',
      combine: null,
    };

    const responderProvided: ResponderProvided = {
      announce: jest.fn(),
    };

    act(() => {
      result.current.handleReorderBoardFields(dropResult, responderProvided);
    });

    expect(result.current.visibleBoardFields).toEqual([
      {
        fieldMetadataId: 'field2',
        isVisible: true,
        position: 0,
      },
      {
        fieldMetadataId: 'field1',
        isVisible: true,
        position: 1,
      },
    ]);
  });

  it('handles visibility changes correctly', () => {
    const { result } = renderWithRecoil();

    act(() => {
      result.current.handleBoardFieldVisibilityChange({
        fieldMetadataId: 'field1',
      } as any);
    });

    expect(result.current.hiddenBoardFields).toContainEqual({
      fieldMetadataId: 'field1',
      isVisible: false,
      position: 0,
    });
  });
});
