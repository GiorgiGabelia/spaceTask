import { LowerCasePipe, KeyValuePipe } from '@angular/common';
import { Component, inject, input, Optional, output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
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
  defaultValues = input<FilterFormValues>();
  displayCta = input(true);

  form?: FormGroup<FilterForm>;

  readonly submitForm = output<FilterFormValues>();
  readonly controlsWithSameTemplate = controlsWithSameTemplate;

  constructor(@Optional() private parentFormGroup: FormGroupDirective) {}

  ngOnInit() {
    this.initForm();
    this.parentFormGroup?.form.addControl('clientFormGroup', this.form);
  }

  resetControl(controlName: keyof FilterForm) {
    this.form?.controls[controlName].reset();
  }

  clearAll() {
    this.form?.reset();
  }

  onSubmit() {
    if (this.form) {
      this.submitForm.emit(this.form.getRawValue());
    }
  }

  private initForm() {
    this.form = new FormGroup({
      clientNumber: new FormControl<number | null>(
        this.defaultValues()?.clientNumber || null,
      ),
      name: new FormControl<string | null>(this.defaultValues()?.name || null, [
        Validators.minLength(2),
        Validators.maxLength(50),
        nameValidator(),
      ]),
      lastName: new FormControl<string | null>(
        this.defaultValues()?.lastName || null,
        [Validators.minLength(2), Validators.maxLength(50), nameValidator()],
      ),
      sex: new FormControl<Sex | null>(this.defaultValues()?.sex || null),
      personalNumber: new FormControl<string | null>(
        this.defaultValues()?.personalNumber || null,
        Validators.maxLength(11),
      ),
      mobileNumber: new FormControl<number | null>(
        this.defaultValues()?.mobileNumber || null,
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
  }

  private generateAddressFormGroup(
    type: 'FACTUAL' | 'JURIDICAL',
  ): AddressFormGroup {
    if (!this.defaultValues()) {
      return {
        city: new FormControl(null),
        country: new FormControl(null),
      };
    }

    const { city, country } =
      this.defaultValues()!.addresses[
        type === 'FACTUAL' ? 'factual' : 'juridical'
      ];

    return {
      city: new FormControl(city),
      country: new FormControl(country),
    };
  }
}
