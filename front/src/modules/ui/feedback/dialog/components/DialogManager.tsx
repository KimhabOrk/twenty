import { useEffect } from 'react';

import { usePreviousHotkeyScope } from '@/ui/utilities/hotkey/hooks/usePreviousHotkeyScope';

import { useDialogInternal } from '../hooks/internal/useDialogManagerScopedStates';
import { useDialogManager } from '../hooks/useDialogManager';
import { DialogHotkeyScope } from '../types/DialogHotkeyScope';

import { Dialog } from './Dialog';

export const DialogManager = ({ children }: React.PropsWithChildren) => {
  const { dialogInternal } = useDialogInternal();
  const { closeDialog } = useDialogManager();

  const { setHotkeyScopeAndMemorizePreviousScope } = usePreviousHotkeyScope();

  useEffect(() => {
    if (dialogInternal.queue.length === 0) {
      return;
    }

    setHotkeyScopeAndMemorizePreviousScope(DialogHotkeyScope.Dialog);
  }, [dialogInternal.queue, setHotkeyScopeAndMemorizePreviousScope]);

  return (
    <>
      {children}
      {dialogInternal.queue.map(({ buttons, children, id, message, title }) => (
        <Dialog
          key={id}
          {...{ title, message, buttons, id, children }}
          onClose={() => closeDialog(id)}
        />
      ))}
    </>
  );
};
