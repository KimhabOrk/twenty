import { useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { useRecoilValue } from 'recoil';

import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { objectMetadataItemsState } from '@/object-metadata/states/objectMetadataItemsState';
import { getRecordFromCache } from '@/object-record/cache/utils/getRecordFromCache';
import { RecordGqlFields } from '@/object-record/graphql/types/RecordGqlFields';
import { generateDepthOneRecordGqlFields } from '@/object-record/graphql/utils/generateDepthOneRecordGqlFields';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';

export const useGetRecordFromCache = ({
  objectNameSingular,
  recordGqlFields,
}: {
  objectNameSingular: string;
  recordGqlFields?: RecordGqlFields;
}) => {
  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const objectMetadataItems = useRecoilValue(objectMetadataItemsState);

  const apolloClient = useApolloClient();

  return useCallback(
    <T extends ObjectRecord = ObjectRecord>(
      recordId: string,
      cache = apolloClient.cache,
    ) => {
      return getRecordFromCache<T>({
        cache,
        recordId,
        objectMetadataItems,
        objectMetadataItem,
        recordGqlFields:
          recordGqlFields ??
          generateDepthOneRecordGqlFields({ objectMetadataItem }),
      });
    },
    [
      apolloClient.cache,
      objectMetadataItems,
      objectMetadataItem,
      recordGqlFields,
    ],
  );
};
