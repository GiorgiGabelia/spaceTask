import { inject, Injectable } from '@angular/core';
import { Account } from '../../state/account/account.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';
import { map } from 'rxjs';

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

  addAccount(clientNumber: string, account: Account) {}

  closeAccount(accountId: string) {}
}
