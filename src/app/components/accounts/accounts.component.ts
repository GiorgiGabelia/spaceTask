import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import {
  Account,
  AccountType,
  Currency,
} from '../../state/account/account.model';
import { AccountService } from '../../services/api/account.service';
import { of, take, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AccountCardComponent } from './account-card/account-card.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateAccountDialogComponent,
  CreateAccountDialogData,
} from './create-account-dialog/create-account-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { AccountActions } from '../../state/account/account.actions';
import { selectClientAccounts } from '../../state/account/account.selectors';

export type AccountMap = {
  [type in AccountType]: Account[];
};

@Component({
  selector: 'app-accounts',
  imports: [AsyncPipe, AccountCardComponent, MatIcon, MatTooltip],
  templateUrl: './accounts.component.html',
})
export class AccountsComponent {
  private readonly store = inject(Store);
  private readonly matDialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  clientNumber = input.required<number>();

  readonly accounts$ = computed(() => {
    const id = this.clientNumber();
    return id
      ? this.store.select(selectClientAccounts(id)).pipe(
          tap((accounts) => {
            if (!accounts) {
              this.store.dispatch(
                AccountActions.loadAccountsForClient({ clientNumber: id }),
              );
            }
          }),
        )
      : of(null);
  });

  openAddDialog(createdAccounts: Account[], type: AccountType) {
    const availableCurrencies: Currency[] = ['EUR', 'GEL', 'USD'];

    const currencies = availableCurrencies.filter((currency) => {
      const accountInThisCurrencyAlreadyCreated = createdAccounts.find(
        (account) => account.currency === currency,
      );

      return !accountInThisCurrencyAlreadyCreated;
    });

    const data: CreateAccountDialogData = {
      currencies,
      type,
    };

    const dialogRef = this.matDialog.open(CreateAccountDialogComponent, {
      data,
    });
    dialogRef
      .afterClosed()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((res?: { [currency in Currency]?: boolean }) => {
        console.log(res);
      });
  }
}
