import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClientActions } from './client.actions';
import { ClientService } from '../../services/client.service';

@Injectable()
export class ClientEffects {
  private readonly actions$ = inject(Actions);
  private readonly clientService = inject(ClientService);

  loadClients$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClientActions.loadClients),
      switchMap(({ page, pageSize }) =>
        this.clientService.getClients({ page, pageSize }).pipe(
          map((response) => ClientActions.loadClientsSuccess(response)),
          catchError((err: Error) =>
            of(ClientActions.loadClientsError({ error: err.message })),
          ),
        ),
      ),
    );
  });
}
