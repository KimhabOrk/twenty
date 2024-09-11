import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { buildShowPageURL } from '@/object-record/record-show/utils/buildShowPageURL';
import { useRecoilComponentValue } from '@/ui/utilities/state/instance/hooks/useRecoilComponentValue';
import { currentViewIdInstanceState } from '@/views/states/currentViewIdInstanceState';
import { useNavigate } from 'react-router-dom';

export const useHandleIndexIdentifierClick = ({
  objectMetadataItem,
  recordIndexId,
}: {
  recordIndexId: string;
  objectMetadataItem: ObjectMetadataItem;
}) => {
  const navigate = useNavigate();

  const currentViewId = useRecoilComponentValue(
    currentViewIdInstanceState,
    recordIndexId,
  );

  const handleIndexIdentifierClick = (recordId: string) => {
    const showPageURL = buildShowPageURL(
      objectMetadataItem.nameSingular,
      recordId,
      currentViewId,
    );

    navigate(showPageURL);
  };

  return { handleIndexIdentifierClick };
};
