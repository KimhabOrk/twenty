import { useSearchRecordGroupField } from '@/object-record/object-options-dropdown/hooks/useSearchRecordGroupField';
import { RecordIndexRootPropsContext } from '@/object-record/record-index/contexts/RecordIndexRootPropsContext';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { RecoilRoot } from 'recoil';
import { FieldMetadataType } from '~/generated/graphql';

jest.mock(
  '@/ui/utilities/state/component-state/hooks/useRecoilComponentStateV2',
  () => ({
    useRecoilComponentStateV2: jest.fn(() => ['', jest.fn()]),
  }),
);

describe('useSearchRecordGroupField', () => {
  const renderWithContext = (contextValue: any) =>
    renderHook(() => useSearchRecordGroupField(), {
      wrapper: ({ children }) => (
        <RecoilRoot>
          <RecordIndexRootPropsContext.Provider value={contextValue}>
            {children}
          </RecordIndexRootPropsContext.Provider>
        </RecoilRoot>
      ),
    });

  it('filters fields correctly based on input', () => {
    const mockContextValue = {
      objectMetadataItem: {
        fields: [
          { type: FieldMetadataType.Select, label: 'First' },
          { type: FieldMetadataType.Select, label: 'Second' },
          { type: FieldMetadataType.Text, label: 'Third' },
        ],
      },
    };

    const { result } = renderWithContext(mockContextValue);

    act(() => {
      result.current.setRecordGroupFieldSearchInput('First');
    });

    expect(result.current.filteredRecordGroupFieldMetadataItems).toEqual([
      { type: FieldMetadataType.Select, label: 'First' },
    ]);
  });

  it('returns all select fields when search input is empty', () => {
    const mockContextValue = {
      objectMetadataItem: {
        fields: [
          { type: FieldMetadataType.Select, label: 'First' },
          { type: FieldMetadataType.Select, label: 'Second' },
          { type: FieldMetadataType.Text, label: 'Third' },
        ],
      },
    };

    const { result } = renderWithContext(mockContextValue);

    expect(result.current.filteredRecordGroupFieldMetadataItems).toEqual([
      { type: FieldMetadataType.Select, label: 'First' },
      { type: FieldMetadataType.Select, label: 'Second' },
    ]);
  });
});
