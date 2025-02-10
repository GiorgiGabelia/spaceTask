import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Client } from './client.model';
import { ClientSlice } from '../../services/models';
import { Sort } from '@angular/material/sort';

export const ClientActions = createActionGroup({
  source: 'Client/API',
  events: {
    'Load Clients': props<{
      page: number;
      pageSize: number;
      sort?: Sort;
    }>(),
    'Load Clients Success': props<ClientSlice>(),
    'Load Clients Error': props<{ error: string }>(),
    'Add Client': props<{ client: Client }>(),
    'Upsert Client': props<{ client: Client }>(),
    'Update Client': props<{ client: Update<Client> }>(),
    'Delete Client': props<{ id: string }>(),
    'Clear Clients': emptyProps(),
  },
});
