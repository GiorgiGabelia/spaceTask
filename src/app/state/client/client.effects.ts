import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClientActions } from './client.actions';
import { ClientService } from '../../services/client.service';
import { Sort } from '@angular/material/sort';

@Injectable()
export class ClientEffects {
  private readonly actions$ = inject(Actions);
  private readonly clientService = inject(ClientService);

  loadClients$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ClientActions.loadClients),
      switchMap(({ page, pageSize, sort }) =>
        this.clientService.getClients({ page, pageSize, sort }).pipe(
          map((response) => {
            this.saveStateToSessionStorage({
              page,
              sort,
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

  private saveStateToSessionStorage(state: { page: number; sort?: Sort }) {
    const keys = Object.keys(state) as (keyof typeof state)[];

    keys.forEach((key) => {
      if (state[key]) {
        sessionStorage.setItem(key, JSON.stringify(state[key]));
      }
    });
  }
}
