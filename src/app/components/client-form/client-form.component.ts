import {
  LowerCasePipe,
  KeyValuePipe,
  TitleCasePipe,
  NgClass,
} from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
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
import { Client, Sex } from '../../state/client/client.model';
import {
  exactLengthValidator,
  nameValidator,
} from '../../validators/validators';
import {
  controlsWithSameTemplate,
  VALIDATION_CONSTANTS,
} from './controlsWithSameTemplate';
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
    TitleCasePipe,
    NgClass,
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
})
export class ClientFormComponent implements OnInit {
  defaultValues = input<FilterFormValues>();
  usedForFiltering = input(false);

  form?: FormGroup<FilterForm>;

  readonly submitForm = output<FilterFormValues>();
  readonly controlsWithSameTemplate = controlsWithSameTemplate;

  ngOnInit() {
    this.initForm();
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

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form?.patchValue({
          avatar: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  private initForm() {
    const validators = {
      name: [
        Validators.minLength(VALIDATION_CONSTANTS.NAME_MIN),
        Validators.maxLength(VALIDATION_CONSTANTS.NAME_MAX),
        nameValidator(),
      ],
      mobileNum: [
        Validators.pattern(/^5.*/),
        this.usedForFiltering()
          ? Validators.maxLength(VALIDATION_CONSTANTS.MOB_NUM_LENGTH)
          : exactLengthValidator(VALIDATION_CONSTANTS.MOB_NUM_LENGTH),
      ],
      personalNum: [
        this.usedForFiltering()
          ? Validators.maxLength(VALIDATION_CONSTANTS.PERS_NUM_LENGTH)
          : exactLengthValidator(VALIDATION_CONSTANTS.PERS_NUM_LENGTH),
      ],
    };

    if (!this.usedForFiltering()) {
      const keys = Object.keys(validators) as (keyof typeof validators)[];
      keys.forEach((key) => validators[key].push(Validators.required));
    }

    this.form = new FormGroup({
      clientNumber: new FormControl<number | null>(
        this.defaultValues()?.clientNumber || null,
        !this.usedForFiltering() ? Validators.required : [],
      ),
      name: new FormControl<string | null>(
        this.defaultValues()?.name || null,
        validators.name,
      ),
      lastName: new FormControl<string | null>(
        this.defaultValues()?.lastName || null,
        validators.name,
      ),
      sex: new FormControl<Sex | null>(
        this.defaultValues()?.sex || null,
        !this.usedForFiltering() ? Validators.required : [],
      ),
      personalNumber: new FormControl<string | null>(
        this.defaultValues()?.personalNumber || null,
        validators.personalNum,
      ),
      mobileNumber: new FormControl<number | null>(
        this.defaultValues()?.mobileNumber || null,
        validators.mobileNum,
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
      avatar: new FormControl(this.defaultValues()?.avatar || null),
    });
  }

  private generateAddressFormGroup(
    type: 'FACTUAL' | 'JURIDICAL',
  ): AddressFormGroup {
    const validator = !this.usedForFiltering() ? Validators.required : [];

    if (!this.defaultValues()) {
      return {
        city: new FormControl(null, validator),
        country: new FormControl(null, validator),
      };
    }

    const { city, country } =
      this.defaultValues()!.addresses[
        type === 'FACTUAL' ? 'factual' : 'juridical'
      ];

    return {
      city: new FormControl(city, validator),
      country: new FormControl(country, validator),
    };
  }
}
