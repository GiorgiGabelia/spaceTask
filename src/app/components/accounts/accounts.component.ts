import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import {
  Account,
  AccountType,
  Currency,
} from '../../state/account/account.model';
import { AccountService } from '../../services/api/account.service';
import { map, of, take } from 'rxjs';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { AccountCardComponent } from './account-card/account-card.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateAccountDialogComponent,
  CreateAccountDialogData,
} from './create-account-dialog/create-account-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type AccountMap = {
  [type in AccountType]: Account[];
};

@Component({
  selector: 'app-accounts',
  imports: [AsyncPipe, AccountCardComponent, MatIcon, MatTooltip],
  templateUrl: './accounts.component.html',
})
export class AccountsComponent {
  private readonly accountService = inject(AccountService);
  private readonly matDialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  clientNumber = input.required<number>();

  // Todo move this to store
  readonly accounts$ = computed(() => {
    const id = this.clientNumber();
    return id
      ? this.accountService.getClientAccounts(id).pipe(
          map((accounts) => {
            const accountMap: AccountMap = {
              ACCUMULATIVE: accounts.filter(
                (account) => account.type === 'ACCUMULATIVE',
              ),
              CURRENT: accounts.filter((account) => account.type === 'CURRENT'),
              SAVING: accounts.filter((account) => account.type === 'SAVING'),
            };

            return accountMap;
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
      .subscribe((res?: { [curency in Currency]?: boolean }) => {
        console.log(res);
      });
  }
}
