import { ReactNode } from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { expect } from '@storybook/test';
import { renderHook } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import { useObjectRecordTable } from '@/object-record/hooks/useObjectRecordTable';
import { useRecordTable } from '@/object-record/record-table/hooks/useRecordTable';
import { RecordTableScope } from '@/object-record/record-table/scopes/RecordTableScope';
import { SnackBarProviderScope } from '@/ui/feedback/snack-bar-manager/scopes/SnackBarProviderScope';
import { getScopeIdFromComponentId } from '@/ui/utilities/recoil-scope/utils/getScopeIdFromComponentId';

const recordTableId = 'people';
const onColumnsChange = jest.fn();

const ObjectNamePluralSetter = ({ children }: { children: ReactNode }) => {
  const { setObjectNamePlural } = useRecordTable({ recordTableId });
  setObjectNamePlural('people');

  return <>{children}</>;
};

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <RecoilRoot>
      <ObjectNamePluralSetter>
        <RecordTableScope
          recordTableScopeId={getScopeIdFromComponentId(recordTableId) ?? ''}
          onColumnsChange={onColumnsChange}
        >
          <SnackBarProviderScope snackBarManagerScopeId="snack-bar-manager">
            <MockedProvider addTypename={false}>{children}</MockedProvider>
          </SnackBarProviderScope>
        </RecordTableScope>
      </ObjectNamePluralSetter>
    </RecoilRoot>
  );
};

describe('useObjectRecordTable', () => {
  it('should skip fetch if currentWorkspace is undefined', async () => {
    const { result } = renderHook(() => useObjectRecordTable(), {
      wrapper: Wrapper,
    });

    expect(result.current.loading).toBe(false);
    expect(Array.isArray(result.current.records)).toBe(true);
    expect(result.current.records.length).toBe(13);
  });
});
