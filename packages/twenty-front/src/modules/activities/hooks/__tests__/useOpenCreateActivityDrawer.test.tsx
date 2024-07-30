import { MockedProvider } from '@apollo/client/testing';
import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';

import { useOpenCreateActivityDrawer } from '@/activities/hooks/useOpenCreateActivityDrawer';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { getObjectMetadataItemsMock } from '@/object-metadata/utils/getObjectMetadataItemsMock';
import { viewableRecordIdState } from '@/object-record/record-right-drawer/states/viewableRecordIdState';

const mockUUID = '37873e04-2f83-4468-9ab7-3f87da6cafad';

jest.mock('uuid', () => ({
  v4: () => mockUUID,
}));

const Wrapper = ({ children }: { children: ReactNode }) => (
  <RecoilRoot>
    <MockedProvider addTypename={false}>{children}</MockedProvider>
  </RecoilRoot>
);

const mockObjectMetadataItems = getObjectMetadataItemsMock();

describe('useOpenCreateActivityDrawer', () => {
  it('works as expected', async () => {
    const { result } = renderHook(
      () => {
        const openActivityRightDrawer = useOpenCreateActivityDrawer({
          activityObjectNameSingular: CoreObjectNameSingular.Note,
        });
        const viewableRecordId = useRecoilValue(viewableRecordIdState);
        const setObjectMetadataItems = useSetRecoilState(
          objectMetadataItemsState,
        );
        return {
          openActivityRightDrawer,
          viewableRecordId,
          setObjectMetadataItems,
        };
      },
      {
        wrapper: Wrapper,
      },
    );

    act(() => {
      result.current.setObjectMetadataItems(mockObjectMetadataItems);
    });

    expect(result.current.viewableRecordId).toBeNull();
    await act(async () => {
      result.current.openActivityRightDrawer({
        targetableObjects: [],
      });
    });
    expect(result.current.viewableRecordId).toBe(mockUUID);
  });
});
