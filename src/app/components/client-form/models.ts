import { FormControl, FormGroup } from '@angular/forms';
import { Client, Sex } from '../../state/client/client.model';
// TODO: rename this interface to ClientForm
export interface ClientForm {
  clientNumber: FormControl<number | null>;
  name: FormControl<string | null>;
  lastName: FormControl<string | null>;
  sex: FormControl<Sex | null>;
  personalNumber: FormControl<string | null>;
  mobileNumber: FormControl<number | null>;
  addresses: FormGroup<{
    factual: FormGroup<AddressFormGroup>;
    juridical: FormGroup<AddressFormGroup>;
  }>;
  avatar: FormControl<string | null>;
}

export interface AddressFormGroup {
  city: FormControl<string | null>;
  country: FormControl<string | null>;
}

export interface ClientFormValues {
  clientNumber: number | null;
  name: string | null;
  lastName: string | null;
  sex: Sex | null;
  personalNumber: string | null;
  mobileNumber: number | null;
  addresses: {
    factual: {
      city: string | null;
      country: string | null;
    };
    juridical: {
      city: string | null;
      country: string | null;
    };
  };
  avatar?: string | null;
}
