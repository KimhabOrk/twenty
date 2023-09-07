import * as React from 'react';

import { useRecoilScopedState } from '@/ui/utilities/recoil-scope/hooks/useRecoilScopedState';

import { activeTabIdScopedState } from '../states/activeTabIdScopedState';

import { Tab } from './Tab';

type SingleTabProps<T> = {
  title: string;
  Icon?: React.ComponentType<T>;
  iconProps?: T;
  id: string;
  hide?: boolean;
  disabled?: boolean;
};

type OwnProps<T> = {
  tabs: SingleTabProps<T>[];
  context: React.Context<string | null>;
};

export function TabList<T extends Record<string, unknown>>({
  tabs,
  context,
}: OwnProps<T>) {
  const initialActiveTabId = tabs[0].id;

  const [activeTabId, setActiveTabId] = useRecoilScopedState(
    activeTabIdScopedState,
    context,
  );

  React.useEffect(() => {
    setActiveTabId(initialActiveTabId);
  }, [initialActiveTabId, setActiveTabId]);

  return (
    <>
      {tabs
        .filter((tab) => !tab.hide)
        .map((tab) => (
          <Tab
            id={tab.id}
            key={tab.id}
            title={tab.title}
            Icon={tab.Icon}
            iconProps={tab.iconProps}
            active={tab.id === activeTabId}
            onClick={() => {
              setActiveTabId(tab.id);
            }}
            disabled={tab.disabled}
          />
        ))}
    </>
  );
}
