import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClientActions } from './client.actions';
import { ClientService } from '../../services/api/client.service';
import { SessionStorageService } from '../../services/session-storage.service';

@Injectable()
export class ClientEffects {
  private readonly actions$ = inject(Actions);
  private readonly clientService = inject(ClientService);
  private readonly sessionStorageService = inject(SessionStorageService);

  loadClients$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClientActions.loadClients),
      switchMap(({ page, pageSize, sort, filters }) =>
        this.clientService
          .getClients({
            page,
            pageSize,
            sort,
            filters:
              filters ||
              this.sessionStorageService.readFiltersStateFromSession(),
          })
          .pipe(
            map((response) => {
              this.sessionStorageService.saveStateToSessionStorage({
                page,
                sort,
                filters,
              });
              return ClientActions.loadClientsSuccess(response);
            }),
            catchError((err: Error) =>
              of(ClientActions.loadClientsError({ error: err.message })),
            ),
          ),
      ),
    );
  });
}
