import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Account, AccountType, Currency } from './account.model';
import { AccountActions } from './account.actions';

export const accountsFeatureKey = 'accounts';

export interface State extends EntityState<Account> {
  accountClientMap:
    | null
    | {
        [clientNumber: number]: {
          [accountType in AccountType]: {
            [curr in Currency]?: number;
          };
        };
      }[];
}

export const adapter: EntityAdapter<Account> = createEntityAdapter<Account>();

export const initialState: State = adapter.getInitialState({
  accountClientMap: null,
});

export const reducer = createReducer(initialState);

export const accountsFeature = createFeature({
  name: accountsFeatureKey,
  reducer,
  extraSelectors: ({ selectAccountsState }) => ({
    ...adapter.getSelectors(selectAccountsState),
  }),
});

export const { selectIds, selectEntities, selectAll, selectTotal } =
  accountsFeature;
