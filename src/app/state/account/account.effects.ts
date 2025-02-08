import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { AccountActions } from './account.actions';

@Injectable()
export class AccountEffects {
  // accountAccounts$ = createEffect(() => {
  //   return this.actions$.pipe(

  //     ofType(AccountActions.accountAccounts),
  //     concatMap(() =>
  //       /** An EMPTY observable only emits completion. Replace with your own observable API request */
  //       EMPTY.pipe(
  //         map(data => AccountActions.accountAccountsSuccess({ data })),
  //         catchError(error => of(AccountActions.accountAccountsFailure({ error }))))
  //     )
  //   );
  // });

  constructor(private actions$: Actions) {}
}
