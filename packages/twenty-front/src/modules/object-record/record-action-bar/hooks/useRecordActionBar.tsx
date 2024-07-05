import { useCallback, useMemo, useState } from 'react';
import { isNonEmptyString } from '@sniptt/guards';
import {
  useRecoilCallback,
  useRecoilValue,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {
  IconClick,
  IconFileExport,
  IconHeart,
  IconHeartOff,
  IconMail,
  IconPuzzle,
  IconTrash,
} from 'twenty-ui';

import { apiConfigState } from '@/client-config/states/apiConfigState';
import { useFavorites } from '@/favorites/hooks/useFavorites';
import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { useExecuteQuickActionOnOneRecord } from '@/object-record/hooks/useExecuteQuickActionOnOneRecord';
import { useDeleteTableData } from '@/object-record/record-index/options/hooks/useDeleteTableData';
import {
  displayedExportProgress,
  useExportTableData,
} from '@/object-record/record-index/options/hooks/useExportTableData';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { actionBarEntriesState } from '@/ui/navigation/action-bar/states/actionBarEntriesState';
import { contextMenuEntriesState } from '@/ui/navigation/context-menu/states/contextMenuEntriesState';
import { ContextMenuEntry } from '@/ui/navigation/context-menu/types/ContextMenuEntry';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { isDefined } from '~/utils/isDefined';

type useRecordActionBarProps = {
  objectMetadataItem: ObjectMetadataItem;
  selectedRecordIds: string[];
  callback?: () => void;
  numSelected?: number;
};

export const useRecordActionBar = ({
  objectMetadataItem,
  selectedRecordIds,
  callback,
  numSelected,
}: useRecordActionBarProps) => {
  const setContextMenuEntries = useSetRecoilState(contextMenuEntriesState);
  const setActionBarEntriesState = useSetRecoilState(actionBarEntriesState);
  const [isDeleteRecordsModalOpen, setIsDeleteRecordsModalOpen] =
    useState(false);

  const { createFavorite, favorites, deleteFavorite } = useFavorites();

  const { executeQuickActionOnOneRecord } = useExecuteQuickActionOnOneRecord({
    objectNameSingular: objectMetadataItem.nameSingular,
  });

  const apiConfig = useRecoilValue(apiConfigState);
  const maxRecords = apiConfig?.mutationMaximumAffectedRecords;

  const handleFavoriteButtonClick = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        if (selectedRecordIds.length > 1) {
          return;
        }

        const selectedRecordId = selectedRecordIds[0];
        const selectedRecord = snapshot
          .getLoadable(recordStoreFamilyState(selectedRecordId))
          .getValue();

        const foundFavorite = favorites?.find(
          (favorite) => favorite.recordId === selectedRecordId,
        );

        const isFavorite = !!selectedRecordId && !!foundFavorite;

        if (isFavorite) {
          deleteFavorite(foundFavorite.id);
        } else if (isDefined(selectedRecord)) {
          createFavorite(selectedRecord, objectMetadataItem.nameSingular);
        }
        callback?.();
      },
    [
      callback,
      createFavorite,
      deleteFavorite,
      favorites,
      objectMetadataItem.nameSingular,
      selectedRecordIds,
    ],
  );

  const baseTableDataParams = {
    delayMs: 100,
    objectNameSingular: objectMetadataItem.nameSingular,
    recordIndexId: objectMetadataItem.namePlural,
  };

  const { deleteTableData } = useDeleteTableData(baseTableDataParams);

  const handleDeleteClick = useCallback(async () => {
    selectedRecordIds.forEach((recordId) => {
      const foundFavorite = favorites?.find(
        (favorite) => favorite.recordId === recordId,
      );
      if (foundFavorite !== undefined) {
        deleteFavorite(foundFavorite.id);
      }
    });
    deleteTableData();
  }, [deleteFavorite, deleteTableData, favorites, selectedRecordIds]);

  const handleExecuteQuickActionOnClick = useCallback(async () => {
    callback?.();
    await Promise.all(
      selectedRecordIds.map(async (recordId) => {
        await executeQuickActionOnOneRecord(recordId);
      }),
    );
  }, [callback, executeQuickActionOnOneRecord, selectedRecordIds]);

  const { progress, download } = useExportTableData({
    ...baseTableDataParams,
    filename: `${objectMetadataItem.nameSingular}.csv`,
  });

  const isRemoteObject = objectMetadataItem.isRemote;

  const baseActions: ContextMenuEntry[] = useMemo(
    () => [
      {
        label: displayedExportProgress(progress),
        Icon: IconFileExport,
        accent: 'default',
        onClick: () => download(),
      },
    ],
    [download, progress],
  );

  const recordsNum = numSelected ?? selectedRecordIds.length;

  const deletionActions: ContextMenuEntry[] = useMemo(
    () =>
      maxRecords !== undefined && recordsNum <= maxRecords
        ? [
            {
              label: 'Delete',
              Icon: IconTrash,
              accent: 'danger',
              onClick: () => setIsDeleteRecordsModalOpen(true),
              ConfirmationModal: (
                <ConfirmationModal
                  isOpen={isDeleteRecordsModalOpen}
                  setIsOpen={setIsDeleteRecordsModalOpen}
                  title={`Delete ${recordsNum} ${
                    recordsNum === 1 ? `record` : 'records'
                  }`}
                  subtitle={`This action cannot be undone. This will permanently delete ${
                    recordsNum === 1 ? 'this record' : 'these records'
                  }`}
                  onConfirmClick={() => handleDeleteClick()}
                  deleteButtonText={`Delete ${
                    recordsNum > 1 ? 'Records' : 'Record'
                  }`}
                />
              ),
            },
          ]
        : [],
    [maxRecords, isDeleteRecordsModalOpen, recordsNum, handleDeleteClick],
  );

  const dataExecuteQuickActionOnmentEnabled = useIsFeatureEnabled(
    'IS_QUICK_ACTIONS_ENABLED',
  );

  const hasOnlyOneRecordSelected = selectedRecordIds.length === 1;

  const isFavorite =
    isNonEmptyString(selectedRecordIds[0]) &&
    !!favorites?.find((favorite) => favorite.recordId === selectedRecordIds[0]);

  return {
    setContextMenuEntries: useCallback(() => {
      setContextMenuEntries([
        ...(isRemoteObject ? [] : deletionActions),
        ...baseActions,
        ...(!isRemoteObject && isFavorite && hasOnlyOneRecordSelected
          ? [
              {
                label: 'Remove from favorites',
                Icon: IconHeartOff,
                onClick: handleFavoriteButtonClick,
              },
            ]
          : []),
        ...(!isRemoteObject && !isFavorite && hasOnlyOneRecordSelected
          ? [
              {
                label: 'Add to favorites',
                Icon: IconHeart,
                onClick: handleFavoriteButtonClick,
              },
            ]
          : []),
      ]);
    }, [
      baseActions,
      deletionActions,
      handleFavoriteButtonClick,
      hasOnlyOneRecordSelected,
      isFavorite,
      isRemoteObject,
      setContextMenuEntries,
    ]),

    setActionBarEntries: useCallback(() => {
      setActionBarEntriesState([
        ...(dataExecuteQuickActionOnmentEnabled
          ? [
              {
                label: 'Actions',
                Icon: IconClick,
                subActions: [
                  {
                    label: 'Enrich',
                    Icon: IconPuzzle,
                    onClick: handleExecuteQuickActionOnClick,
                  },
                  {
                    label: 'Send to mailjet',
                    Icon: IconMail,
                  },
                ],
              },
            ]
          : []),
        ...(isRemoteObject ? [] : deletionActions),
        ...baseActions,
      ]);
    }, [
      baseActions,
      dataExecuteQuickActionOnmentEnabled,
      deletionActions,
      handleExecuteQuickActionOnClick,
      isRemoteObject,
      setActionBarEntriesState,
    ]),
  };
};
