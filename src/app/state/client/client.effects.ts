import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { ClientActions } from './client.actions';

@Injectable()
export class ClientEffects {
  // clientClients$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(ClientActions.clientClients),
  //     concatMap(() =>
  //       /** An EMPTY observable only emits completion. Replace with your own observable API request */
  //       EMPTY.pipe(
  //         map((data) => ClientActions.clientClientsSuccess({ data })),
  //         catchError((error) =>
  //           of(ClientActions.clientClientsFailure({ error }))
  //         )
  //       )
  //     )
  //   );
  // });

  constructor(private actions$: Actions) {}
}
