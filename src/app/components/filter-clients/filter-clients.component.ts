import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { Sex } from '../../state/client/client.model';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { KeyValuePipe, LowerCasePipe } from '@angular/common';
import { nameValidator } from '../../validators/validators';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { AddressFormGroup, FilterForm } from './models';
import { controlsWithSameTemplate } from './controlsWithSameTemplate';

@Component({
  selector: 'app-filter-clients',
  imports: [
    MatDialogClose,
    MatDivider,
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
  templateUrl: './filter-clients.component.html',
  styleUrl: './filter-clients.component.scss',
})
export class FilterClientsComponent {
  readonly filterForm: FormGroup<FilterForm> = new FormGroup({
    clientNumber: new FormControl<number | null>(null),
    name: new FormControl<string | null>(null, [
      Validators.minLength(2),
      Validators.maxLength(50),
      nameValidator(),
    ]),
    lastName: new FormControl<string | null>(null, [
      Validators.minLength(2),
      Validators.maxLength(50),
      nameValidator(),
    ]),
    sex: new FormControl<Sex | null>(null),
    personalNumber: new FormControl<string | null>(
      null,
      Validators.maxLength(11),
    ),
    mobileNumber: new FormControl<number | null>(null, [
      Validators.pattern(/^5.*/),
      Validators.maxLength(9),
    ]),
    addresses: new FormGroup({
      factual: new FormGroup<AddressFormGroup>(this.generateAddressFormGroup()),
      juridical: new FormGroup<AddressFormGroup>(
        this.generateAddressFormGroup(),
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

  private generateAddressFormGroup(): AddressFormGroup {
    return {
      city: new FormControl(null),
      country: new FormControl(null),
    };
  }
}
