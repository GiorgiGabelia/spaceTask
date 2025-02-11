import { LowerCasePipe, KeyValuePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Sex } from '../../state/client/client.model';
import { nameValidator } from '../../validators/validators';
import { controlsWithSameTemplate } from './controlsWithSameTemplate';
import { FilterFormValues, FilterForm, AddressFormGroup } from './models';
import { SessionStorageService } from '../../services/session-storage.service';

@Component({
  selector: 'app-client-form',
  imports: [
    MatIcon,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSuffix,
    MatFormFieldModule,
    MatButtonModule,
    LowerCasePipe,
    KeyValuePipe,
    MatRadioButton,
    MatRadioGroup,
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
})
export class ClientFormComponent {
  readonly formValues = inject(
    SessionStorageService,
  ).readFiltersStateFromSession();

  submitFromHere = input(true);

  submittedFormValues = output<FilterFormValues>();

  readonly filterForm: FormGroup<FilterForm> = new FormGroup({
    clientNumber: new FormControl<number | null>(
      this.formValues?.clientNumber || null,
    ),
    name: new FormControl<string | null>(this.formValues?.name || null, [
      Validators.minLength(2),
      Validators.maxLength(50),
      nameValidator(),
    ]),
    lastName: new FormControl<string | null>(
      this.formValues?.lastName || null,
      [Validators.minLength(2), Validators.maxLength(50), nameValidator()],
    ),
    sex: new FormControl<Sex | null>(this.formValues?.sex || null),
    personalNumber: new FormControl<string | null>(
      this.formValues?.personalNumber || null,
      Validators.maxLength(11),
    ),
    mobileNumber: new FormControl<number | null>(
      this.formValues?.mobileNumber || null,
      [Validators.pattern(/^5.*/), Validators.maxLength(9)],
    ),
    // TODO: add address (street) to the form
    addresses: new FormGroup({
      factual: new FormGroup<AddressFormGroup>(
        this.generateAddressFormGroup('FACTUAL'),
      ),
      juridical: new FormGroup<AddressFormGroup>(
        this.generateAddressFormGroup('JURIDICAL'),
      ),
    }),
  });

  readonly controlsWithSameTemplate = controlsWithSameTemplate;

  resetControl(controlName: keyof FilterForm) {
    this.filterForm.controls[controlName].reset();
  }

  clearAll() {
    this.filterForm.reset();
  }

  onSubmit() {
    if (this.submitFromHere())
      this.submittedFormValues.emit(this.filterForm.getRawValue());
  }

  private generateAddressFormGroup(
    type: 'FACTUAL' | 'JURIDICAL',
  ): AddressFormGroup {
    if (!this.formValues) {
      return {
        city: new FormControl(null),
        country: new FormControl(null),
      };
    }

    const { city, country } =
      this.formValues!.addresses[type === 'FACTUAL' ? 'factual' : 'juridical'];

    return {
      city: new FormControl(city),
      country: new FormControl(country),
    };
  }
}
