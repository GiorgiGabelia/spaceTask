import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Client } from './client.model';
import { ClientActions } from './client.actions';
import { Sort } from '@angular/material/sort';

export const clientsFeatureKey = 'clients';
export interface State extends EntityState<Client> {
  paging?: {
    totalClients: number;
    pageSize: number;
    pageClientIdMap: { [page: number]: string[] };
  };
  sort?: Sort;
}

export const adapter: EntityAdapter<Client> = createEntityAdapter<Client>();

export const initialState: State = adapter.getInitialState({});

export const reducer = createReducer(
  initialState,
  on(
    ClientActions.loadClientsSuccess,
    (state, { clients, page, totalItems, pageSize, sort, filterUpdated }) => {
      const sortUpdated =
        sort?.active !== state.sort?.active ||
        sort?.direction !== state.sort?.direction;

      const updatedState =
        sortUpdated || filterUpdated
          ? adapter.setAll(clients, state)
          : adapter.addMany(clients, state);

      const pageClientIdMap =
        sortUpdated || filterUpdated
          ? {}
          : { ...state.paging?.pageClientIdMap };

      pageClientIdMap[page] = clients.map((client) => client.id);

      return {
        ...updatedState,
        paging: {
          totalClients: totalItems,
          pageSize: state.paging?.pageSize ?? pageSize,
          pageClientIdMap,
        },
        sort,
      };
    },
  ),
  on(ClientActions.loadClientSuccess, (state, action) =>
    adapter.addOne(action.client, state),
  ),
  on(ClientActions.addClientSuccess, (state, action) =>
    adapter.addOne(action.client, state),
  ),
  on(ClientActions.updateClientSuccess, (state, { client }) =>
    adapter.updateOne({ id: client.id, changes: client }, state),
  ),
  on(ClientActions.deleteClientSuccess, (state, action) =>
    adapter.removeOne(action.id, state),
  ),
  on(
    ClientActions.loadClientError,
    ClientActions.loadClientsError,
    ClientActions.addClientError,
    ClientActions.updateClientError,
    ClientActions.deleteClientError,
    (state, { error }) => ({
      ...state,
      error,
    }),
  ),
);
