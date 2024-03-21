import { useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { isNonEmptyArray } from '@apollo/client/utilities';
import { isNonEmptyString } from '@sniptt/guards';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { ObjectMetadataItemIdentifier } from '@/object-metadata/types/ObjectMetadataItemIdentifier';
import { useMapConnectionToRecords } from '@/object-record/hooks/useMapConnectionToRecords';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import { ObjectRecordEdge } from '@/object-record/types/ObjectRecordEdge';
import { ObjectRecordQueryVariables } from '@/object-record/types/ObjectRecordQueryVariables';
import { filterUniqueRecordEdgesByCursor } from '@/object-record/utils/filterUniqueRecordEdgesByCursor';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { isDefined } from '~/utils/isDefined';
import { logError } from '~/utils/logError';
import { capitalize } from '~/utils/string/capitalize';

import { cursorFamilyState } from '../states/cursorFamilyState';
import { hasNextPageFamilyState } from '../states/hasNextPageFamilyState';
import { isFetchingMoreRecordsFamilyState } from '../states/isFetchingMoreRecordsFamilyState';
import { ObjectRecordQueryResult } from '../types/ObjectRecordQueryResult';

export const useFindManyRecordsV2 = <T extends ObjectRecord = ObjectRecord>({
  objectNameSingular,
  filter,
  orderBy,
  limit,
  onCompleted,
  skip,
  depth,
}: ObjectMetadataItemIdentifier &
  ObjectRecordQueryVariables & {
    onCompleted?: (records: T[]) => void;
    skip?: boolean;
    depth?: number;
  }) => {
  const mapConnectionToRecords = useMapConnectionToRecords();

  const findManyQueryStateIdentifier =
    objectNameSingular +
    JSON.stringify(filter) +
    JSON.stringify(orderBy) +
    limit;

  const [lastCursor, setLastCursor] = useRecoilState(
    cursorFamilyState(findManyQueryStateIdentifier),
  );

  const [hasNextPage, setHasNextPage] = useRecoilState(
    hasNextPageFamilyState(findManyQueryStateIdentifier),
  );

  const setIsFetchingMoreObjects = useSetRecoilState(
    isFetchingMoreRecordsFamilyState(findManyQueryStateIdentifier),
  );

  const { objectMetadataItem, findManyRecordsQuery } = useObjectMetadataItem(
    {
      objectNameSingular,
    },
    depth,
  );

  const { enqueueSnackBar } = useSnackBar();
  const currentWorkspaceMember = useRecoilValue(currentWorkspaceMemberState);

  const { data, loading, error, fetchMore } = useQuery<
    ObjectRecordQueryResult<T>
  >(findManyRecordsQuery, {
    skip: skip || !objectMetadataItem || !currentWorkspaceMember,
    variables: {
      filter,
      limit,
      orderBy,
    },
    onCompleted: (data) => {
      if (!isDefined(data)) {
        onCompleted?.([]);
      }

      const pageInfo = data?.[objectMetadataItem.namePlural]?.pageInfo;

      const records = mapConnectionToRecords({
        objectRecordConnection: data?.[objectMetadataItem.namePlural],
        objectNameSingular,
        depth: 5,
      }) as T[];

      onCompleted?.(records);

      if (isDefined(data?.[objectMetadataItem.namePlural])) {
        setLastCursor(pageInfo.endCursor ?? '');
        setHasNextPage(pageInfo.hasNextPage ?? false);
      }
    },
    onError: (error) => {
      logError(
        `useFindManyRecords for "${objectMetadataItem.namePlural}" error : ` +
          error,
      );
      enqueueSnackBar(
        `Error during useFindManyRecords for "${objectMetadataItem.namePlural}", ${error.message}`,
        {
          variant: 'error',
        },
      );
    },
  });

  const fetchMoreRecords = useCallback(async () => {
    if (hasNextPage) {
      setIsFetchingMoreObjects(true);

      try {
        await fetchMore({
          variables: {
            filter,
            orderBy,
            lastCursor: isNonEmptyString(lastCursor) ? lastCursor : undefined,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            const previousEdges = prev?.[objectMetadataItem.namePlural]?.edges;
            const nextEdges =
              fetchMoreResult?.[objectMetadataItem.namePlural]?.edges;

            let newEdges: ObjectRecordEdge<T>[] = [];

            if (isNonEmptyArray(previousEdges) && isNonEmptyArray(nextEdges)) {
              newEdges = filterUniqueRecordEdgesByCursor([
                ...(prev?.[objectMetadataItem.namePlural]?.edges ?? []),
                ...(fetchMoreResult?.[objectMetadataItem.namePlural]?.edges ??
                  []),
              ]);
            }

            const pageInfo =
              fetchMoreResult?.[objectMetadataItem.namePlural]?.pageInfo;

            if (isDefined(data?.[objectMetadataItem.namePlural])) {
              setLastCursor(pageInfo.endCursor ?? '');
              setHasNextPage(pageInfo.hasNextPage ?? false);
            }

            const records = mapConnectionToRecords({
              objectRecordConnection: {
                edges: newEdges,
                pageInfo,
              },
              objectNameSingular,
              depth: 5,
            }) as T[];

            onCompleted?.(records);

            return Object.assign({}, prev, {
              [objectMetadataItem.namePlural]: {
                __typename: `${capitalize(
                  objectMetadataItem.nameSingular,
                )}Connection`,
                edges: newEdges,
                pageInfo:
                  fetchMoreResult?.[objectMetadataItem.namePlural].pageInfo,
                totalCount:
                  fetchMoreResult?.[objectMetadataItem.namePlural].totalCount,
              },
            } as ObjectRecordQueryResult<T>);
          },
        });
      } catch (error) {
        logError(
          `fetchMoreObjects for "${objectMetadataItem.namePlural}" error : ` +
            error,
        );
        enqueueSnackBar(
          `Error during fetchMoreObjects for "${objectMetadataItem.namePlural}", ${error}`,
          {
            variant: 'error',
          },
        );
      } finally {
        setIsFetchingMoreObjects(false);
      }
    }
  }, [
    hasNextPage,
    setIsFetchingMoreObjects,
    fetchMore,
    filter,
    orderBy,
    lastCursor,
    objectMetadataItem.namePlural,
    objectMetadataItem.nameSingular,
    onCompleted,
    data,
    setLastCursor,
    setHasNextPage,
    enqueueSnackBar,
    mapConnectionToRecords,
    objectNameSingular,
  ]);

  const totalCount = data?.[objectMetadataItem.namePlural].totalCount ?? 0;

  const records = useMemo(
    () =>
      mapConnectionToRecords({
        objectRecordConnection: data?.[objectMetadataItem.namePlural],
        objectNameSingular,
        depth: 5,
      }) as T[],

    [
      data,
      objectNameSingular,
      objectMetadataItem.namePlural,
      mapConnectionToRecords,
    ],
  );

  return {
    objectMetadataItem,
    records,
    totalCount,
    loading,
    error,
    fetchMoreRecords,
    queryStateIdentifier: findManyQueryStateIdentifier,
  };
};
