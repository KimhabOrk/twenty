import { useEffect } from 'react';

import { useColumnDefinitionsFromFieldMetadata } from '@/object-metadata/hooks/useColumnDefinitionsFromFieldMetadata';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useRecordActionBar } from '@/object-record/record-action-bar/hooks/useRecordActionBar';
import { useRecordTable } from '@/object-record/record-table/hooks/useRecordTable';
import { filterAvailableTableColumns } from '@/object-record/utils/filterAvailableTableColumns';
import { useViewBar } from '@/views/hooks/useViewBar';

type RecordIndexTableContainerEffectProps = {
  objectNameSingular: string;
  recordTableId: string;
  viewBarId: string;
};

export const RecordIndexTableContainerEffect = ({
  objectNameSingular,
  recordTableId,
  viewBarId,
}: RecordIndexTableContainerEffectProps) => {
  const {
    setAvailableTableColumns,
    setOnEntityCountChange,
    resetTableRowSelection,
  } = useRecordTable({
    recordTableId,
  });

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { columnDefinitions, filterDefinitions, sortDefinitions } =
    useColumnDefinitionsFromFieldMetadata(objectMetadataItem);

  const { setEntityCountInCurrentView } = useViewBar({
    viewBarId,
  });

  useEffect(() => {
    const availableTableColumns = columnDefinitions.filter(
      filterAvailableTableColumns,
    );

    setAvailableTableColumns(availableTableColumns);
  }, [
    columnDefinitions,
    objectMetadataItem,
    sortDefinitions,
    filterDefinitions,
    setAvailableTableColumns,
  ]);

  const { setActionBarEntries, setContextMenuEntries } = useRecordActionBar({
    objectMetadataItem,
    callback: resetTableRowSelection,
  });

  useEffect(() => {
    setActionBarEntries?.();
    setContextMenuEntries?.();
  }, [setActionBarEntries, setContextMenuEntries]);

  useEffect(() => {
    setOnEntityCountChange(
      () => (entityCount: number) => setEntityCountInCurrentView(entityCount),
    );
  }, [setEntityCountInCurrentView, setOnEntityCountChange]);

  return <></>;
};
