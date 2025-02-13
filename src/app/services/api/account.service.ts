import { inject, Injectable } from '@angular/core';
import {
  Account,
  AccountType,
  Currency,
} from '../../state/account/account.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { forkJoin, map } from 'rxjs';
import { AccountRequest } from './models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly http = inject(HttpClient);

  private readonly accountsPath = '/accounts';

  getClientAccounts(clientNumber: number) {
    const httpParams = new HttpParams({
      fromObject: {
        clientNumber,
      },
    });

    return this.http
      .get(env.apiBaseUrl + this.accountsPath, { params: httpParams })
      .pipe(map((res) => res as Account[]));
  }

  addAccounts(request: AccountRequest) {
    const accounts: Omit<Account, 'id'>[] = request.accounts.map((req) => ({
      ...req,
      clientNumber: request.clientNumber,
      accountNumber: this.generateRandomAccountNumber(),
      status: 'ACTIVE',
    }));

    return forkJoin(
      accounts.map((account) =>
        this.http.post<Account>(env.apiBaseUrl + this.accountsPath, account),
      ),
    );
  }

  closeAccount(accountId: string) {}

  // NOTE: since we have fake BE generating account number here
  private generateRandomAccountNumber() {
    return Math.floor(1000000000000 + Math.random() * 9000000000000);
  }
}
