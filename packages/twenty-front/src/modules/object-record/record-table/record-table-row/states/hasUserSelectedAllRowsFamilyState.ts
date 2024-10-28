import { RecordTableScopeInternalContext } from '@/object-record/record-table/scopes/scope-internal-context/RecordTableScopeInternalContext';
import { createComponentStateV2 } from '@/ui/utilities/state/component-state/utils/createComponentStateV2';

export const hasUserSelectedAllRowsComponentState =
  createComponentStateV2<boolean>({
    key: 'hasUserSelectedAllRowsFamilyState',
    defaultValue: false,
    componentInstanceContext: RecordTableScopeInternalContext,
  });
