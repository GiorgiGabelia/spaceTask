import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Client } from './client.model';
import { ClientSlice } from '../../services/api/models';
import { Sort } from '@angular/material/sort';
import { FilterFormValues } from '../../components/client-form/models';

export const ClientActions = createActionGroup({
  source: 'Client/API',
  events: {
    'Load Clients': props<{
      page: number;
      pageSize: number;
      sort?: Sort;
      filters?: FilterFormValues;
    }>(),
    'Load Clients Success': props<{ filterUpdated: boolean } & ClientSlice>(),
    'Load Clients Error': props<{ error: string }>(),
    'Load Client': props<{ id: string }>(),
    'Load Client Success': props<{ client: Client }>(),
    'Load Client Error': props<{ error: string }>(),
    'Add Client': props<{ client: Client }>(),
    'Add Client Success': props<{ client: Client }>(),
    'Add Client Error': props<{ error: string }>(),
    'Update Client': props<{ client: Client }>(),
    'Update Client Success': props<{ client: Client }>(),
    'Update Client Error': props<{ error: string }>(),
    'Delete Client': props<{ id: string }>(),
    'Delete Client Success': props<{ id: string }>(),
    'Delete Client error': props<{ error: string }>(),
  },
});
