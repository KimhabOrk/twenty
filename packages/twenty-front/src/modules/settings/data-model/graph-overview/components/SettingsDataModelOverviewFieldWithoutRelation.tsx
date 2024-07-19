import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { useIcons } from 'twenty-ui';

import { FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { capitalize } from '~/utils/string/capitalize';

type ObjectFieldRowWithoutRelationProps = {
  field: FieldMetadataItem;
};

const StyledRow = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  position: relative;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing(2)};
`;

const StyledFieldName = styled.div`
  color: ${({ theme }) => theme.font.color.primary};
`;

export const ObjectFieldRowWithoutRelation = ({
  field,
}: ObjectFieldRowWithoutRelationProps) => {
  const { getIcon } = useIcons();
  const theme = useTheme();

  const Icon = getIcon(field?.icon);

  return (
    <StyledRow>
      {Icon && <Icon size={theme.icon.size.md} />}
      <StyledFieldName>{capitalize(field.name)}</StyledFieldName>
    </StyledRow>
  );
};
