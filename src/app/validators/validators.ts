import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const engRegex = /^[A-Za-z]+$/;
    const geoRegex = /^[\u10A0-\u10FF]+$/;

    if (engRegex.test(value) || geoRegex.test(value)) {
      return null;
    }

    return { invalidInput: true };
  };
}
