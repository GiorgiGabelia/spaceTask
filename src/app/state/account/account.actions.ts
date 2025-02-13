import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { Account, AccountType } from './account.model';
import { AccountRequest } from '../../services/api/models';

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
    'Add Accounts For Client': props<AccountRequest>(),
    'Add Accounts For Client Success': props<{
      clientNumber: number;
      accounts: Account[];
    }>(),
    'Add Accounts For Client Error': props<{
      error: string;
    }>(),
    'Close Account': props<{
      id: string;
      clientNumber: number;
      accountType: AccountType;
    }>(),
    'Close Account Success': props<{
      id: string;
      clientNumber: number;
      accountType: AccountType;
    }>(),
    'Close Account Error': props<{ error: string }>(),
  },
});
