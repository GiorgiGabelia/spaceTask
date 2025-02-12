import { LowerCasePipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnInit,
  Optional,
  output,
} from '@angular/core';
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
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
})
export class ClientFormComponent implements OnInit {
  defaultValues = input<FilterFormValues>();
  displayCta = input(true);
  usedForFiltering = input(false);
  allValuesRequired = input(false);

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

    if (this.allValuesRequired()) {
      const keys = Object.keys(validators) as (keyof typeof validators)[];
      keys.forEach((key) => validators[key].push(Validators.required));
    }

    this.form = new FormGroup({
      clientNumber: new FormControl<number | null>(
        this.defaultValues()?.clientNumber || null,
        this.allValuesRequired() ? Validators.required : [],
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
        this.allValuesRequired() ? Validators.required : [],
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
    });
  }

  private generateAddressFormGroup(
    type: 'FACTUAL' | 'JURIDICAL',
  ): AddressFormGroup {
    const validator = this.allValuesRequired() ? Validators.required : [];

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
