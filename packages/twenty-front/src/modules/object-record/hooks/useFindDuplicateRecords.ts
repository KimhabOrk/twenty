import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { ObjectMetadataItemIdentifier } from '@/object-metadata/types/ObjectMetadataItemIdentifier';
import { getRecordsFromRecordConnection } from '@/object-record/cache/utils/getRecordsFromRecordConnection';
import { RecordGqlConnection } from '@/object-record/graphql/types/RecordGqlConnection';
import { RecordGqlOperationFindManyResult } from '@/object-record/graphql/types/RecordGqlOperationFindManyResult';
import { useFindDuplicateRecordsQuery } from '@/object-record/hooks/useFindDuplicatesRecordsQuery';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import { getFindDuplicateRecordsQueryResponseField } from '@/object-record/utils/getFindDuplicateRecordsQueryResponseField';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { logError } from '~/utils/logError';

export const useFindDuplicateRecords = <T extends ObjectRecord = ObjectRecord>({
  objectRecordId = '',
  objectNameSingular,
  onCompleted,
}: ObjectMetadataItemIdentifier & {
  objectRecordId: string | undefined;
  onCompleted?: (data: RecordGqlConnection) => void;
  skip?: boolean;
}) => {
  const findDuplicateQueryStateIdentifier = objectNameSingular;

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { findDuplicateRecordsQuery } = useFindDuplicateRecordsQuery({
    objectNameSingular,
  });

  const { enqueueSnackBar } = useSnackBar();

  const queryResponseField = getFindDuplicateRecordsQueryResponseField(
    objectMetadataItem.nameSingular,
  );

  const { data, loading, error } = useQuery<RecordGqlOperationFindManyResult>(
    findDuplicateRecordsQuery,
    {
      variables: {
        id: objectRecordId,
      },
      onCompleted: (data) => {
        onCompleted?.(data[queryResponseField]);
      },
      onError: (error) => {
        logError(
          `useFindDuplicateRecords for "${objectMetadataItem.nameSingular}" error : ` +
            error,
        );
        enqueueSnackBar(
          `Error during useFindDuplicateRecords for "${objectMetadataItem.nameSingular}", ${error.message}`,
          {
            variant: 'error',
          },
        );
      },
    },
  );

  const objectRecordConnection = data?.[queryResponseField];

  const records = useMemo(
    () =>
      objectRecordConnection
        ? (getRecordsFromRecordConnection({
            recordConnection: objectRecordConnection,
          }) as T[])
        : [],
    [objectRecordConnection],
  );

  return {
    objectMetadataItem,
    records,
    totalCount: objectRecordConnection?.totalCount,
    loading,
    error,
    queryStateIdentifier: findDuplicateQueryStateIdentifier,
  };
};
