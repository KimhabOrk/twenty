import { styled } from '@linaria/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { IconTwentyStarFilled, THEME_COMMON, ThemeContext } from 'twenty-ui';

import { useClearField } from '@/object-record/record-field/hooks/useClearField';
import { RATING_VALUES } from '@/object-record/record-field/meta-types/constants/RatingValues';
import { FieldRatingValue } from '@/object-record/record-field/types/FieldMetadata';

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
`;

const StyledRatingIconContainer = styled.div<{
  color: string;
}>`
  color: ${({ color }) => color};
  display: inline-flex;
`;

type RatingInputProps = {
  onChange?: (newValue: FieldRatingValue) => void;
  value: FieldRatingValue;
  readonly?: boolean;
};

const iconSizeMd = THEME_COMMON.icon.size.md;

export const RatingInput = ({
  onChange,
  value,
  readonly,
}: RatingInputProps) => {
  const { theme } = useContext(ThemeContext);
  const clearField = useClearField();

  const activeColor = theme.font.color.secondary;
  const inactiveColor = theme.background.quaternary;

  const [hoveredValue, setHoveredValue] = useState<FieldRatingValue>(
    null,
  );
  
  const currentValue = hoveredValue ?? value;
  
  const selectedIndex = currentValue ? RATING_VALUES.indexOf(currentValue) : -1;
  
  const previousRating = useRef<FieldRatingValue>(null);

  const handleClick = (value: FieldRatingValue) => {
    if(readonly) return undefined;
    if(previousRating.current === currentValue) {
      setHoveredValue(null);
      clearField();
    } else {
      onChange?.(value)
    }
  }

   useEffect(() => {
      previousRating.current = value;
   },[value])

  return (
    <StyledContainer
      role="slider"
      aria-label="Rating"
      aria-valuemax={RATING_VALUES.length}
      aria-valuemin={1}
      aria-valuenow={selectedIndex + 1}
      tabIndex={0}
    >
      {RATING_VALUES.map((value, index) => {
        const isActive = index <= selectedIndex;

        return (
          <StyledRatingIconContainer
            key={index}
            color={isActive ? activeColor : inactiveColor}
            onClick={() => handleClick(value)}
            onMouseEnter={readonly ? undefined : () => setHoveredValue(value)}
            onMouseLeave={readonly ? undefined : () => setHoveredValue(null)}
          >
            <IconTwentyStarFilled size={iconSizeMd} />
          </StyledRatingIconContainer>
        );
      })}
    </StyledContainer>
  );
};
