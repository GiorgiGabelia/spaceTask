import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, clientsFeatureKey, State } from './client.reducer';

export const selectClientState =
  createFeatureSelector<State>(clientsFeatureKey);

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectClients = createSelector(selectClientState, (state) =>
  selectAll(state),
);

export const selectClientById = (clientId: string) =>
  createSelector(selectClientState, (state) => selectEntities(state));
