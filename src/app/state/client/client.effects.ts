import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClientActions } from './client.actions';
import { ClientService } from '../../services/api/client.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';

@Injectable()
export class ClientEffects {
  private readonly actions$ = inject(Actions);
  private readonly clientService = inject(ClientService);
  private readonly sessionStorageService = inject(SessionStorageService);
  private readonly snackBarService = inject(SnackbarService);
  private readonly router = inject(Router);

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
            catchError((err: Error) => {
              this.snackBarService.open(
                'Error fetching the clients, please refresh the page to try again.',
                'FAIL',
              );
              return of(ClientActions.loadClientsError({ error: err.message }));
            }),
          ),
      ),
    ),
  );

  loadClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClient),
      switchMap(({ id }) =>
        this.clientService.getClient(id).pipe(
          map((client) => {
            return ClientActions.loadClientSuccess({ client });
          }),
          catchError((err: Error) => {
            this.snackBarService.open(
              'Error fetching the client, please refresh the page to try again.',
              'FAIL',
            );
            return of(ClientActions.loadClientError({ error: err.message }));
          }),
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

  deleteClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.deleteClient),
      switchMap(({ id }) =>
        this.clientService.deleteClient(id).pipe(
          map(() => {
            this.snackBarService.open('Successfully deleted client', 'SUCCESS');
            this.router.navigate(['/clients']);
            return ClientActions.deleteClientSuccess({ id });
          }),
          catchError((err: Error) => {
            this.snackBarService.open(
              'Error deleting client, please try again.',
              'FAIL',
            );
            return of(ClientActions.deleteClientError({ error: err.message }));
          }),
        ),
      ),
    ),
  );
}
