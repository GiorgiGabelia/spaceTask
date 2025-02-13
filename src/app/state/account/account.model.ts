export type AccountType = 'CURRENT' | 'SAVING' | 'ACCUMULATIVE';
export type Currency = 'USD' | 'GEL' | 'EUR';
export type Status = 'ACTIVE' | 'CLOSED';

export interface Account {
  id: string;
  accountNumber: number;
  clientNumber: number;
  type: AccountType;
  currency: Currency;
  status: Status;
}
