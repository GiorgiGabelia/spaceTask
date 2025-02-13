import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AccountActions } from './account.actions';
import { AccountService } from '../../services/api/account.service';
import { SnackbarService } from '../../services/snackbar.service';

@Injectable()
export class AccountEffects {
  private readonly accountService = inject(AccountService);
  private readonly actions$ = inject(Actions);
  private readonly snackBarService = inject(SnackbarService);

  loadAccountsForClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.loadAccountsForClient),
      switchMap(({ clientNumber }) =>
        this.accountService.getClientAccounts(clientNumber).pipe(
          map((accounts) =>
            AccountActions.loadAccountsForClientSuccess({
              accounts,
              clientNumber,
            }),
          ),
          catchError((err: Error) =>
            of(
              AccountActions.loadAccountsForClientError({
                error: err.message,
              }),
            ),
          ),
        ),
      ),
    ),
  );

  addAccountsForClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.addAccountsForClient),
      switchMap((action) =>
        this.accountService
          .addAccounts({
            clientNumber: action.clientNumber,
            accounts: action.accounts,
          })
          .pipe(
            map((accounts) => {
              this.snackBarService.open(
                'Account(s) successfully created',
                'SUCCESS',
              );
              return AccountActions.addAccountsForClientSuccess({
                accounts,
                clientNumber: action.clientNumber,
              });
            }),
            catchError((err: Error) => {
              this.snackBarService.open(
                "Couldn't create account(s). Please try again.",
                'FAIL',
              );
              return of(
                AccountActions.addAccountsForClientError({
                  error: err.message,
                }),
              );
            }),
          ),
      ),
    ),
  );
}
