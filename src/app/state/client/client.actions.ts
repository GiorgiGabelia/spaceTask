import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Client } from './client.model';

export const ClientActions = createActionGroup({
  source: 'Client/API',
  events: {
    'Load Clients': props<{ clients: Client[] }>(),
    'Add Client': props<{ client: Client }>(),
    'Upsert Client': props<{ client: Client }>(),
    'Update Client': props<{ client: Update<Client> }>(),
    'Delete Client': props<{ id: string }>(),
    'Clear Clients': emptyProps(),
  },
});
