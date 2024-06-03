import { formatISOStringToHumanReadableDate } from '~/utils/date-utils';

import { EllipsisDisplay } from './EllipsisDisplay';

type DateTimeDisplayProps = {
  value: string | null | undefined;
};

export const DateTimeDisplay = ({ value }: DateTimeDisplayProps) => (
  <EllipsisDisplay>
    {value ? formatISOStringToHumanReadableDate(value) : ''}
  </EllipsisDisplay>
);
