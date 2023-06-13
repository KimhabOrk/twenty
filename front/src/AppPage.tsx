import { DefaultLayout } from '@/ui/layout/DefaultLayout';

import { AppNavbar } from './AppNavbar';

type OwnProps = {
  children: JSX.Element;
};

export function AppPage({ children }: OwnProps) {
  return <DefaultLayout navbar={AppNavbar()}>{children}</DefaultLayout>;
}
