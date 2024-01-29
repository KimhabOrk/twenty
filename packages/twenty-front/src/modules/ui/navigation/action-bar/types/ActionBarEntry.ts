import { IconComponent } from '@/ui/display/icon/types/IconComponent';
import { MenuItemAccent } from '@/ui/navigation/menu-item/types/MenuItemAccent';

export type ActionBarEntry = {
  label: string;
  Icon: IconComponent;
  accent?: MenuItemAccent;
  onClick?: (selectedIds: string[]) => void;
  isVisible?: (selectedRecordIds: string[]) => boolean;
  subActions?: ActionBarEntry[];
};
