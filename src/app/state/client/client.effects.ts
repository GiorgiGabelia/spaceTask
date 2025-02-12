import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClientActions } from './client.actions';
import { ClientService } from '../../services/api/client.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { SnackbarService } from '../../services/snackbar.service';

@Injectable()
export class ClientEffects {
  private readonly actions$ = inject(Actions);
  private readonly clientService = inject(ClientService);
  private readonly sessionStorageService = inject(SessionStorageService);
  private readonly snackBarService = inject(SnackbarService);

  loadClients$ = createEffect(() =>
    this.actions$.pipe(
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
    ),
  );

  addClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.addClient),
      switchMap(({ client }) =>
        this.clientService.createClient(client).pipe(
          map((client) => {
            this.snackBarService.open('Successfully created client', 'SUCCESS');
            return ClientActions.addClientSuccess({ client });
          }),
          catchError((err: Error) => {
            this.snackBarService.open(
              'Error creating client, please try again.',
              'FAIL',
            );
            return of(ClientActions.addClientError({ error: err.message }));
          }),
        ),
      ),
    ),
  );

  updateClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.updateClient),
      switchMap(({ client }) =>
        this.clientService.updateClient(client).pipe(
          map((client) => {
            this.snackBarService.open('Successfully updated client', 'SUCCESS');
            return ClientActions.updateClientSuccess({ client });
          }),
          catchError((err: Error) => {
            this.snackBarService.open(
              'Error updating client, please try again.',
              'FAIL',
            );
            return of(ClientActions.updateClientError({ error: err.message }));
          }),
        ),
      ),
    ),
  );
}
