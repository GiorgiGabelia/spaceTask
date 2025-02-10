import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, clientsFeatureKey, State } from './client.reducer';

export const selectClientState =
  createFeatureSelector<State>(clientsFeatureKey);

const { selectAll, selectEntities } = adapter.getSelectors();

export const selectClients = createSelector(selectClientState, (state) =>
  selectAll(state),
);

export const selectClientSlice = (pageIndex: number) =>
  createSelector(selectClientState, (state) => ({
    clients: (state.paging?.pageClientIdMap[pageIndex] || [])
      .map((id) => state.entities[id])
      .filter((client) => !!client),
    totalItems: state.paging?.totalClients,
    pageSize: state.paging?.pageSize,
    sort: state.sort,
  }));

export const selectClientById = (clientId: string) =>
  createSelector(selectClientState, (state) => selectEntities(state));
