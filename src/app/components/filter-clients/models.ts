import { FormControl, FormGroup } from '@angular/forms';
import { Sex } from '../../state/client/client.model';

export interface FilterForm {
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
}

export interface AddressFormGroup {
  city: FormControl<string | null>;
  country: FormControl<string | null>;
}
