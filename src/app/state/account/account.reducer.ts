import { createReducer, on } from '@ngrx/store';
import { State } from './account.model';
import { AccountActions } from './account.actions';

export const accountsFeatureKey = 'accounts';

export const initialState: State = { accounts: {} };

export const reducer = createReducer(
  initialState,
  on(
    AccountActions.loadAccountsForClientSuccess,
    (state, { accounts, clientNumber }) => ({
      ...state,
      accounts: {
        ...state.accounts,
        [clientNumber]: {
          ACCUMULATIVE: accounts.filter(
            (account) => account.type === 'ACCUMULATIVE',
          ),
          CURRENT: accounts.filter((account) => account.type === 'CURRENT'),
          SAVING: accounts.filter((account) => account.type === 'SAVING'),
        },
      },
    }),
  ),
  on(
    AccountActions.addAccountsForClientSuccess,
    (state, { accounts, clientNumber }) => {
      const type = accounts[0].type;

      return {
        ...state,
        accounts: {
          ...state.accounts,
          [clientNumber]: {
            ...state.accounts[clientNumber],
            [type]: [...state.accounts[clientNumber][type], ...accounts],
          },
        },
      };
    },
  ),
  on(
    AccountActions.closeAccountSuccess,
    (state, { id, clientNumber, accountType }) => {
      const updatedAccounts = state.accounts[clientNumber][accountType].map(
        (account) =>
          account.id === id ? { ...account, status: 'CLOSED' } : account,
      );

      return {
        ...state,
        accounts: {
          ...state.accounts,
          [clientNumber]: {
            ...state.accounts[clientNumber],
            [accountType]: updatedAccounts,
          },
        },
      };
    },
  ),
  on(
    AccountActions.loadAccountsForClientError,
    AccountActions.addAccountsForClientError,
    AccountActions.closeAccountError,
    (state, { error }) => ({
      ...state,
      error,
    }),
  ),
);
