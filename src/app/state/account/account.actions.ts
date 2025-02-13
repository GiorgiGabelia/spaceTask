import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Account } from './account.model';

export const AccountActions = createActionGroup({
  source: 'Account/API',
  events: {
    'Load Accounts For Client': props<{
      clientNumber: number;
    }>(),
    'Load Accounts For Client Success': props<{
      accounts: Account[];
      clientNumber: number;
    }>(),
    'Load Accounts For Client Error': props<{
      error: string;
    }>(),
    'Add Account For Client': props<{
      clientNumber: number;
      account: Account;
    }>(),
    'Add Account For Client Success': props<{
      clientNumber: number;
      account: Account;
    }>(),
    'Add Account For Client Error': props<{
      error: string;
    }>(),
    'Close Account': props<{ accountId: string }>(),
    'Close Account Success': props<{ accountId: string }>(),
    'Close Account Error': props<{ error: string }>(),
  },
});
