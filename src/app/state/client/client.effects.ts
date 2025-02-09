import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { Observable, EMPTY, of, pipe } from 'rxjs';
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
        this.clientService.loadClients({ page, pageSize }).pipe(
          map((clients) => ClientActions.loadClientsSuccess({ clients })),
          catchError((err: Error) =>
            of(ClientActions.loadClientsError({ error: err.message })),
          ),
        ),
      ),
    );
  });
}
