import { useRecoilState } from 'recoil';

import { useHotkeysScopeOnMountOnly } from '@/hotkeys/hooks/useHotkeysScopeOnMountOnly';
import { InternalHotkeysScope } from '@/hotkeys/types/internal/InternalHotkeysScope';
import { RightDrawerBody } from '@/ui/layout/right-drawer/components/RightDrawerBody';
import { RightDrawerPage } from '@/ui/layout/right-drawer/components/RightDrawerPage';
import { RightDrawerTopBar } from '@/ui/layout/right-drawer/components/RightDrawerTopBar';

import { commentableEntityArrayState } from '../states/commentableEntityArrayState';

import { Timeline } from './Timeline';

export function RightDrawerTimeline() {
  const [commentableEntityArray] = useRecoilState(commentableEntityArrayState);

  useHotkeysScopeOnMountOnly({
    scope: InternalHotkeysScope.RightDrawer,
    customScopes: { goto: false, 'command-menu': true },
  });

  return (
    <RightDrawerPage>
      <RightDrawerTopBar title="Timeline" />
      <RightDrawerBody>
        {commentableEntityArray.map((commentableEntity) => (
          <Timeline
            entity={{
              id: commentableEntity?.id ?? '',
              type: commentableEntity.type,
            }}
          />
        ))}
      </RightDrawerBody>
    </RightDrawerPage>
  );
}
