import { Observable } from 'rxjs';

export interface Client {
  id: string;
  clientNumber: number;
  name: string;
  lastName: string;
  sex: Sex;
  personalNumber: string;
  mobileNumber: number;
  addresses: {
    juridical: Address;
    factual: Address;
  };
  avatarRequest$?: Observable<string | undefined>;
}

export type Sex = 'Male' | 'Female';

export interface Address {
  country: string;
  city: string;
  address?: string;
}
