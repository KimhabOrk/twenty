import { FAVORITE_FOLDER_PICKER_DROPDOWN_ID } from '@/favorites/favorite-folder-picker/constants/FavoriteFolderPickerDropdownId';
import { useCreateFavorite } from '@/favorites/hooks/useCreateFavorite';
import { useDeleteFavorite } from '@/favorites/hooks/useDeleteFavorite';
import { useFavorites } from '@/favorites/hooks/useFavorites';
import { useFilteredObjectMetadataItems } from '@/object-metadata/hooks/useFilteredObjectMetadataItems';
import { isObjectMetadataReadOnly } from '@/object-metadata/utils/isObjectMetadataReadOnly';
import { RecordIndexPageKanbanAddButton } from '@/object-record/record-index/components/RecordIndexPageKanbanAddButton';
import { RecordIndexRootPropsContext } from '@/object-record/record-index/contexts/RecordIndexRootPropsContext';
import { recordIndexViewTypeState } from '@/object-record/record-index/states/recordIndexViewTypeState';
import { usePrefetchedData } from '@/prefetch/hooks/usePrefetchedData';
import { PrefetchKey } from '@/prefetch/types/PrefetchKey';
import { PageAddButton } from '@/ui/layout/page/components/PageAddButton';
import { PageFavoriteButton } from '@/ui/layout/page/components/PageFavoriteButton';
import { PageFavoriteFoldersDropdown } from '@/ui/layout/page/components/PageFavoriteFolderDropdown';
import { PageHeader } from '@/ui/layout/page/components/PageHeader';
import { PageHotkeysEffect } from '@/ui/layout/page/components/PageHotkeysEffect';
import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
import { currentViewIdComponentState } from '@/views/states/currentViewIdComponentState';
import { View } from '@/views/types/View';
import { ViewType } from '@/views/types/ViewType';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { isDefined, useIcons } from 'twenty-ui';
import { capitalize } from '~/utils/string/capitalize';

export const RecordIndexPageHeader = () => {
  const { findObjectMetadataItemByNamePlural } =
    useFilteredObjectMetadataItems();
  const isFavoriteFolderEnabled = useIsFeatureEnabled(
    'IS_FAVORITE_FOLDER_ENABLED',
  );

  const { objectNamePlural, onCreateRecord, recordIndexId } = useContext(
    RecordIndexRootPropsContext,
  );
  const { records: views } = usePrefetchedData<View>(PrefetchKey.AllViews);
  const currentViewId = useRecoilComponentValueV2(
    currentViewIdComponentState,
    recordIndexId,
  );

  const view = views.find((view) => view.id === currentViewId);

  const favorites = useFavorites();

  const createFavorite = useCreateFavorite();

  const deleteFavorite = useDeleteFavorite();

  const isFavorite = favorites.some(
    (favorite) =>
      favorite.recordId === currentViewId && favorite.workspaceMemberId,
  );

  const handleFavoriteButtonClick = async () => {
    if (!view) return;

    const correspondingFavorite = favorites.find(
      (favorite) =>
        favorite.recordId === currentViewId && favorite.workspaceMemberId,
    );

    if (isFavorite && isDefined(correspondingFavorite)) {
      deleteFavorite(correspondingFavorite.id);
    } else {
      createFavorite(view, 'view');
    }
  };
  const objectMetadataItem =
    findObjectMetadataItemByNamePlural(objectNamePlural);

  const { getIcon } = useIcons();
  const Icon = getIcon(
    findObjectMetadataItemByNamePlural(objectNamePlural)?.icon,
  );

  const recordIndexViewType = useRecoilValue(recordIndexViewTypeState);

  const shouldDisplayAddButton = objectMetadataItem
    ? !isObjectMetadataReadOnly(objectMetadataItem)
    : false;

  const isTable = recordIndexViewType === ViewType.Table;

  const pageHeaderTitle =
    objectMetadataItem?.labelPlural ?? capitalize(objectNamePlural);

  const handleAddButtonClick = () => {
    onCreateRecord();
  };

  return (
    <PageHeader title={pageHeaderTitle} Icon={Icon}>
      <PageHotkeysEffect onAddButtonClick={handleAddButtonClick} />
      {isFavoriteFolderEnabled ? (
        <PageFavoriteFoldersDropdown
          record={view}
          dropdownId={FAVORITE_FOLDER_PICKER_DROPDOWN_ID}
          objectNameSingular="view"
          isFavorite={isFavorite}
        />
      ) : (
        <PageFavoriteButton
          isFavorite={isFavorite}
          onClick={handleFavoriteButtonClick}
        />
      )}
      {shouldDisplayAddButton &&
        (isTable ? (
          <PageAddButton onClick={handleAddButtonClick} />
        ) : (
          <RecordIndexPageKanbanAddButton />
        ))}
    </PageHeader>
  );
};
