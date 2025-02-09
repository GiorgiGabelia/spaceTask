import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Client } from './client.model';
import { ClientActions } from './client.actions';

export const clientsFeatureKey = 'clients';

export interface State extends EntityState<Client> {
  loading: boolean;
  empty?: boolean;
  totalClients?: number;
  currentPage?: number;
}

export const adapter: EntityAdapter<Client> = createEntityAdapter<Client>();

export const initialState: State = adapter.getInitialState({
  loading: false,
});

export const reducer = createReducer(
  initialState,
  on(ClientActions.loadClientsSuccess, (state, { clients }) =>
    adapter.setAll(clients, state),
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
