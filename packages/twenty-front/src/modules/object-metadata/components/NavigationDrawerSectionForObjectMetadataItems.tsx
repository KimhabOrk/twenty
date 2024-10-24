import { NavigationDrawerItemForObjectMetadataItem } from '@/object-metadata/components/NavigationDrawerItemForObjectMetadataItem';
import { ObjectMetadataItem } from '@/object-metadata/types/ObjectMetadataItem';
import { NavigationDrawerAnimatedCollapseWrapper } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerAnimatedCollapseWrapper';
import { NavigationDrawerSection } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSection';
import { NavigationDrawerSectionTitle } from '@/ui/navigation/navigation-drawer/components/NavigationDrawerSectionTitle';
import { useNavigationSection } from '@/ui/navigation/navigation-drawer/hooks/useNavigationSection';
import { isNavigationDrawerExpandedState } from '@/ui/navigation/states/isNavigationDrawerExpanded';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { ScrollWrapper } from '@/ui/utilities/scroll/components/ScrollWrapper';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';

const ORDERED_STANDARD_OBJECTS = [
  'person',
  'company',
  'opportunity',
  'task',
  'note',
];

const StyledObjectsMetaDataItemsWrapper = styled.div`
  display: flex;
  flex-direction: ${() => (useIsMobile() ? 'row' : 'column')};
  gap: ${({ theme }) => (useIsMobile() ? '' : theme.betweenSiblingsGap)};
  width: 100%;
  margin-bottom: ${({ theme }) => (useIsMobile() ? '' : theme.spacing(3))};
  flex: 1;
  overflow: hidden;
`;

export const NavigationDrawerSectionForObjectMetadataItems = ({
  sectionTitle,
  isRemote,
  objectMetadataItems,
  mobileNavigationDrawer,
}: {
  sectionTitle: string;
  isRemote: boolean;
  objectMetadataItems: ObjectMetadataItem[];
  mobileNavigationDrawer?:boolean,
}) => {
  const isMobile = useIsMobile();
  const { toggleNavigationSection, isNavigationSectionOpenState } =
    useNavigationSection('Objects' + (isRemote ? 'Remote' : 'Workspace'));
  const isNavigationSectionOpen = useRecoilValue(isNavigationSectionOpenState);

  const sortedStandardObjectMetadataItems = [...objectMetadataItems]
    .filter((item) => ORDERED_STANDARD_OBJECTS.includes(item.nameSingular))
    .sort((objectMetadataItemA, objectMetadataItemB) => {
      const indexA = ORDERED_STANDARD_OBJECTS.indexOf(
        objectMetadataItemA.nameSingular,
      );
      const indexB = ORDERED_STANDARD_OBJECTS.indexOf(
        objectMetadataItemB.nameSingular,
      );
      if (indexA === -1 || indexB === -1) {
        return objectMetadataItemA.nameSingular.localeCompare(
          objectMetadataItemB.nameSingular,
        );
      }
      return indexA - indexB;
    });

  const sortedCustomObjectMetadataItems = [...objectMetadataItems]
    .filter((item) => !ORDERED_STANDARD_OBJECTS.includes(item.nameSingular))
    .sort((objectMetadataItemA, objectMetadataItemB) => {
      return new Date(objectMetadataItemA.createdAt) <
        new Date(objectMetadataItemB.createdAt)
        ? 1
        : -1;
    });

  const objectMetadataItemsForNavigationItems = [
    ...sortedStandardObjectMetadataItems,
    ...sortedCustomObjectMetadataItems,
  ];

  return (
    objectMetadataItems.length > 0 && (
      <NavigationDrawerSection>
        {!isMobile && (
          <NavigationDrawerAnimatedCollapseWrapper>
            <NavigationDrawerSectionTitle
              label={sectionTitle}
              onClick={() => toggleNavigationSection()}
            />
          </NavigationDrawerAnimatedCollapseWrapper>
        )}
        <ScrollWrapper contextProviderName="navigationDrawer">
          <StyledObjectsMetaDataItemsWrapper>
            {isNavigationSectionOpen &&
              objectMetadataItemsForNavigationItems.map(
                (objectMetadataItem) => (
                  <NavigationDrawerItemForObjectMetadataItem
                    mobileNavigationDrawer={mobileNavigationDrawer}
                    objectMetadataItem={objectMetadataItem}
                  />
                ),
              )}
          </StyledObjectsMetaDataItemsWrapper>
        </ScrollWrapper>
      </NavigationDrawerSection>
    )
  );
};
