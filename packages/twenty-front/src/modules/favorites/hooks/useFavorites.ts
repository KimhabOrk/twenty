import { calculateNewPosition } from '@/favorites/utils/calculateNewPosition';
import { sortFavorites } from '@/favorites/utils/sortFavorites';
import { useGetObjectRecordIdentifierByNameSingular } from '@/object-metadata/hooks/useGetObjectRecordIdentifierByNameSingular';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useDeleteOneRecord } from '@/object-record/hooks/useDeleteOneRecord';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import { OnDragEndResponder } from '@hello-pangea/dnd';
import { useMemo } from 'react';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { usePrefetchedFavoritesData } from './usePrefetchedFavoritesData';

export const useFavorites = () => {
  const { favorites, workspaceFavorites, folders, currentWorkspaceMemberId } =
    usePrefetchedFavoritesData();

  const { objectMetadataItem: favoriteObjectMetadataItem } =
    useObjectMetadataItem({
      objectNameSingular: CoreObjectNameSingular.Favorite,
    });

  const { deleteOneRecord } = useDeleteOneRecord({
    objectNameSingular: CoreObjectNameSingular.Favorite,
  });

  const { updateOneRecord: updateOneFavorite } = useUpdateOneRecord({
    objectNameSingular: CoreObjectNameSingular.Favorite,
  });

  const { createOneRecord: createOneFavorite } = useCreateOneRecord({
    objectNameSingular: CoreObjectNameSingular.Favorite,
  });

  const favoriteRelationFieldMetadataItems = useMemo(
    () =>
      favoriteObjectMetadataItem.fields.filter(
        (fieldMetadataItem) =>
          fieldMetadataItem.type === FieldMetadataType.Relation &&
          fieldMetadataItem.name !== 'workspaceMember' &&
          fieldMetadataItem.name !== 'favoriteFolder',
      ),
    [favoriteObjectMetadataItem.fields],
  );

  const getObjectRecordIdentifierByNameSingular =
    useGetObjectRecordIdentifierByNameSingular();

  const favoritesSorted = useMemo(() => {
    return sortFavorites(
      favorites,
      favoriteRelationFieldMetadataItems,
      getObjectRecordIdentifierByNameSingular,
      true,
    );
  }, [
    favoriteRelationFieldMetadataItems,
    favorites,
    getObjectRecordIdentifierByNameSingular,
  ]);

  const workspaceFavoritesSorted = useMemo(() => {
    return sortFavorites(
      workspaceFavorites.filter((favorite) => favorite.viewId),
      favoriteRelationFieldMetadataItems,
      getObjectRecordIdentifierByNameSingular,
      false,
    );
  }, [
    favoriteRelationFieldMetadataItems,
    getObjectRecordIdentifierByNameSingular,
    workspaceFavorites,
  ]);

  const favoritesByFolder = useMemo(() => {
    return folders.map((folder) => ({
      folderId: folder.id,
      folderName: folder.name,
      favorites: sortFavorites(
        favorites.filter((favorite) => favorite.favoriteFolderId === folder.id),
        favoriteRelationFieldMetadataItems,
        getObjectRecordIdentifierByNameSingular,
        true,
      ),
    }));
  }, [
    folders,
    favorites,
    favoriteRelationFieldMetadataItems,
    getObjectRecordIdentifierByNameSingular,
  ]);

  const createFavorite = (
    targetRecord: ObjectRecord,
    targetObjectNameSingular: string,
    favoriteFolderId?: string,
  ) => {
    const relevantFavorites = favoriteFolderId
      ? favorites.filter((fav) => fav.favoriteFolderId === favoriteFolderId)
      : favorites.filter((fav) => !fav.favoriteFolderId);

    const maxPosition = Math.max(
      ...relevantFavorites.map((fav) => fav.position),
      0,
    );

    createOneFavorite({
      [targetObjectNameSingular]: targetRecord,
      position: maxPosition + 1,
      workspaceMemberId: currentWorkspaceMemberId,
      favoriteFolderId,
    });
  };

  const deleteFavorite = (favoriteId: string) => {
    deleteOneRecord(favoriteId);
  };

  const handleReorderFavorite: OnDragEndResponder = (result) => {
    if (!result.destination) return;

    const draggedFavoriteId = result.draggableId;
    const draggedFavorite = favorites.find((f) => f.id === draggedFavoriteId);

    if (!draggedFavorite) return;

    const relevantFavorites = draggedFavorite.favoriteFolderId
      ? sortFavorites(
          favorites.filter(
            (favorite) =>
              favorite.favoriteFolderId === draggedFavorite.favoriteFolderId,
          ),
          favoriteRelationFieldMetadataItems,
          getObjectRecordIdentifierByNameSingular,
          true,
        )
      : sortFavorites(
          favorites.filter(
            (favorite) => !favorite.favoriteFolderId && !favorite.viewId,
          ),
          favoriteRelationFieldMetadataItems,
          getObjectRecordIdentifierByNameSingular,
          true,
        );

    if (!relevantFavorites.length) return;

    const newPosition = calculateNewPosition({
      destinationIndex: result.destination.index,
      sourceIndex: result.source.index,
      items: relevantFavorites,
    });

    updateOneFavorite({
      idToUpdate: draggedFavoriteId,
      updateOneRecordInput: { position: newPosition },
    });
  };

  return {
    favorites: favoritesSorted,
    workspaceFavorites: workspaceFavoritesSorted,
    favoritesByFolder,
    createFavorite,
    handleReorderFavorite,
    deleteFavorite,
  };
};
