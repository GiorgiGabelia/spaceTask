import { createFeatureSelector, createSelector } from '@ngrx/store';
import { accountsFeatureKey } from './account.reducer';
import { State } from './account.model';

const selectAccountState = createFeatureSelector<State>(accountsFeatureKey);

export const selectClientAccounts = (clientNumber: number) =>
  createSelector(selectAccountState, (state) => state.accounts[clientNumber]);
