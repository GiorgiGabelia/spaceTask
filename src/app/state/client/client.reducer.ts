import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Client } from './client.model';
import { ClientActions } from './client.actions';
import { Sort } from '@angular/material/sort';

export const clientsFeatureKey = 'clients';

export interface State extends EntityState<Client> {
  loading: boolean;
  paging?: {
    totalClients: number;
    pageSize: number;
    pageClientIdMap: { [page: number]: string[] };
  };
  sort?: Sort;
}

export const adapter: EntityAdapter<Client> = createEntityAdapter<Client>();

export const initialState: State = adapter.getInitialState({
  // TODO: use loading in reducers
  loading: false,
});

export const reducer = createReducer(
  initialState,
  on(
    ClientActions.loadClientsSuccess,
    (state, { clients, page, totalItems, pageSize, sort }) => {
      // Ensure totalItems is set
      const total = state.paging?.totalClients ?? totalItems;

      const sortUpdated =
        sort?.active !== state.sort?.active ||
        sort?.direction !== state.sort?.direction;

      // If user changed sort state, override store with new entities, if not simply add the entities
      const updatedState = sortUpdated
        ? adapter.setAll(clients, state)
        : adapter.addMany(clients, state);

      const pageClientIdMap = sortUpdated
        ? {}
        : { ...state.paging?.pageClientIdMap };

      pageClientIdMap[page] = clients.map((client) => client.id);

      return {
        ...updatedState,
        paging: {
          totalClients: total,
          pageSize: state.paging?.pageSize ?? pageSize,
          pageClientIdMap,
        },
        sort,
      };
    },
  ),
  // on(ClientActions.addClient, (state, action) =>
  //   adapter.addOne(action.client, state),
  // ),
  // on(ClientActions.upsertClient, (state, action) =>
  //   adapter.upsertOne(action.client, state),
  // ),
  // on(ClientActions.updateClient, (state, action) =>
  //   adapter.updateOne(action.client, state),
  // ),
  // on(ClientActions.deleteClient, (state, action) =>
  //   adapter.removeOne(action.id, state),
  // ),

  // on(ClientActions.clearClients, (state) => adapter.removeAll(state)),
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
