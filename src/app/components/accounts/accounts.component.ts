import { Component, computed, inject, input } from '@angular/core';
import { Account, AccountType } from '../../state/account/account.model';
import { AccountService } from '../../services/api/account.service';
import { map, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

export type AccountMap = {
  [type in AccountType]: Account[];
};

@Component({
  selector: 'app-accounts',
  imports: [AsyncPipe],
  templateUrl: './accounts.component.html',
})
export class AccountsComponent {
  private readonly accountService = inject(AccountService);

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
}
