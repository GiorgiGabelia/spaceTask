import { createFeatureSelector, createSelector } from '@ngrx/store';
import { accountsFeatureKey } from './account.reducer';
import { AccountClientNumberMap } from './account.model';

const selectAccountState =
  createFeatureSelector<AccountClientNumberMap>(accountsFeatureKey);

export const selectClientAccounts = (clientNumber: number) =>
  createSelector(selectAccountState, (state) => state[clientNumber]);
