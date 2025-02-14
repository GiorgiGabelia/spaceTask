import { Sort } from '@angular/material/sort';
import { Client } from '../../state/client/client.model';
import { AccountType, Currency } from '../../state/account/account.model';

export interface ClientSlice {
  clients: Client[];
  page: number;
  pageSize: number;
  totalItems: number;
  sort?: Sort;
}

export interface AccountRequest {
  clientNumber: number;
  accounts: { type: AccountType; currency: Currency }[];
}
