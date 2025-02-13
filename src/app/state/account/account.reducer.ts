import { createReducer, on } from '@ngrx/store';
import { AccountClientNumberMap } from './account.model';
import { AccountActions } from './account.actions';

// TODO: no errors written in store
// TODO: no errors written in store
// TODO: no errors written in store
export const accountsFeatureKey = 'accounts';

export const initialState: AccountClientNumberMap = {};

export const reducer = createReducer(
  initialState,
  on(
    AccountActions.loadAccountsForClientSuccess,
    (state, { accounts, clientNumber }) => ({
      ...state,
      [clientNumber]: {
        ACCUMULATIVE: accounts.filter(
          (account) => account.type === 'ACCUMULATIVE',
        ),
        CURRENT: accounts.filter((account) => account.type === 'CURRENT'),
        SAVING: accounts.filter((account) => account.type === 'SAVING'),
      },
    }),
  ),
  on(
    AccountActions.addAccountsForClientSuccess,
    (state, { accounts, clientNumber }) => {
      const type = accounts[0].type;

      return {
        ...state,
        [clientNumber]: {
          ...state[clientNumber],
          [type]: [...state[clientNumber][type], ...accounts],
        },
      };
    },
  ),
);
