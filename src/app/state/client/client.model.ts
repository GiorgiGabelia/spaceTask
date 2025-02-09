import { Observable } from 'rxjs';

export interface Client {
  id: string;
  clientNumber: number;
  name: string;
  lastName: string;
  sex: Sex;
  personalNumber: string;
  mobileNumber: number;
  address: {
    juridical: Address;
    factual: Address;
  };
  avatarRequest$?: Observable<string | undefined>;
}

export type Sex = 'Male' | 'Female';

interface Address {
  country: string;
  city: string;
  address: string;
}
