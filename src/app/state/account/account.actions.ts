import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Account } from './account.model';

export const AccountActions = createActionGroup({
  source: 'Account/API',
  events: {
    'Load Accounts For Client': props<{
      clientNumber: number;
      accounts: Account[];
    }>(),
    'Add Account For Client': props<{
      clientNumber: number;
      account: Account;
    }>(),
    'Delete Account For Client': props<{ id: string }>(),
  },
});
