import { useRecoilValue } from 'recoil';

import { isWorkspaceSchemaCreatedState } from '@/auth/states/isWorkspaceSchemaCreated';
import { ObjectMetadataItemNotFoundError } from '@/object-metadata/errors/ObjectMetadataNotFoundError';
import { objectMetadataItemFamilySelector } from '@/object-metadata/states/objectMetadataItemFamilySelector';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { getObjectMetadataItemsMock } from '@/object-metadata/utils/getObjectMetadataItemsMock';
import { isDefined } from '~/utils/isDefined';

import { ObjectMetadataItemIdentifier } from '../types/ObjectMetadataItemIdentifier';

export const useObjectMetadataItemOnly = ({
  objectNameSingular,
}: ObjectMetadataItemIdentifier) => {
  const isWorkspaceSchemaCreated = useRecoilValue(
    isWorkspaceSchemaCreatedState,
  );
  const mockObjectMetadataItems = getObjectMetadataItemsMock();

  let objectMetadataItem = useRecoilValue(
    objectMetadataItemFamilySelector({
      objectName: objectNameSingular,
      objectNameType: 'singular',
    }),
  );

  let objectMetadataItems = useRecoilValue(objectMetadataItemsState);

  if (!isWorkspaceSchemaCreated) {
    objectMetadataItem =
      mockObjectMetadataItems.find(
        (objectMetadataItem) =>
          objectMetadataItem.nameSingular === objectNameSingular,
      ) ?? null;
    objectMetadataItems = mockObjectMetadataItems;
  }

  if (!isDefined(objectMetadataItem)) {
    throw new ObjectMetadataItemNotFoundError(
      objectNameSingular,
      objectMetadataItems,
    );
  }

  return {
    objectMetadataItem,
  };
};
