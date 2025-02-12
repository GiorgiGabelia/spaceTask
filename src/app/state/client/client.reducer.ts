import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Client } from './client.model';
import { ClientActions } from './client.actions';
import { Sort } from '@angular/material/sort';
import { ClientSlice } from '../../services/api/models';

export const clientsFeatureKey = 'clients';

export interface State extends EntityState<Client> {
  loading: boolean;
  paging?: {
    totalClients: number;
    pageSize: number;
    pageClientIdMap: { [page: number]: string[] };
  };
  sort?: Sort;
  filters: ClientSlice['filters'];
}

export const adapter: EntityAdapter<Client> = createEntityAdapter<Client>();

export const initialState: State = adapter.getInitialState({
  // TODO: use loading in reducers
  loading: false,
  filters: [],
});

export const reducer = createReducer(
  initialState,
  on(
    ClientActions.loadClientsSuccess,
    (state, { clients, page, totalItems, pageSize, sort, filters }) => {
      const sortUpdated =
        sort?.active !== state.sort?.active ||
        sort?.direction !== state.sort?.direction;

      const filterUpdated =
        state.filters.some((filter) => !filters.includes(filter)) ||
        filters.some((filter) => !state.filters.includes(filter));

      // If user updated sort state or filters, override store with new entities
      // If not, simply add the entities
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
        filters,
      };
    },
  ),
  on(ClientActions.loadClientSuccess, (state, action) =>
    adapter.addOne(action.client, state),
  ),
  // on(ClientActions.addClient, (state, action) =>
  //   adapter.addOne(action.client, state),
  // ),
  on(ClientActions.updateClientSuccess, (state, { client }) =>
    adapter.updateOne({ id: client.id, changes: client }, state),
  ),
  on(ClientActions.deleteClient, (state, action) =>
    adapter.removeOne(action.id, state),
  ),
);

// export const clientsFeature = createFeature({
//   name: clientsFeatureKey,
//   reducer,
//   extraSelectors: ({ selectClientsState }) => ({
//     ...adapter.getSelectors(selectClientsState),
//   }),
// });

// export const { selectIds, selectEntities, selectAll, selectTotal } =
//   clientsFeature;
