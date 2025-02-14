import { createFeatureSelector, createSelector } from '@ngrx/store';
import { clientsFeatureKey, State } from './client.reducer';

const selectClientState = createFeatureSelector<State>(clientsFeatureKey);

export const selectClientSlice = (pageIndex: number) =>
  createSelector(selectClientState, (state) => {
    const isRequestedPageLoaded = !!state.paging?.pageClientIdMap[pageIndex];

    return {
      clients: isRequestedPageLoaded
        ? state
            .paging!.pageClientIdMap[pageIndex].map((id) => state.entities[id])
            .filter((client) => !!client)
        : null,
      totalItems: state.paging?.totalClients,
      pageSize: state.paging?.pageSize,
      sort: state.sort,
    };
  });

export const selectClientById = (clientId: string) =>
  createSelector(selectClientState, (state) => state.entities[clientId]);
