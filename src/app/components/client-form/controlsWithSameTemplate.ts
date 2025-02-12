import { FilterForm } from '../client-form/models';

export const VALIDATION_CONSTANTS = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  PERS_NUM_LENGTH: 11,
  MOB_NUM_LENGTH: 9,
};

export const controlsWithSameTemplate: {
  controlName: keyof FilterForm;
  inputType: 'number' | 'string';
  label: string;
  errorMessageMapping?: {
    [k: string]: string;
  };
}[] = [
  {
    controlName: 'clientNumber',
    inputType: 'number',
    label: 'Client number',
  },
  {
    controlName: 'name',
    inputType: 'string',
    label: 'Name',
    errorMessageMapping: {
      invalidInput: 'Please use only English or only Georgian characters.',
      minlength: `Client names names must be more than ${VALIDATION_CONSTANTS.NAME_MIN} characters`,
      maxlength: `Client names must be less than ${VALIDATION_CONSTANTS.NAME_MAX} characters`,
    },
  },
  {
    controlName: 'lastName',
    inputType: 'string',
    label: 'Last name',
    errorMessageMapping: {
      invalidInput: 'Please use only English or only Georgian characters.',
      minlength: `Client last names must be more than ${VALIDATION_CONSTANTS.NAME_MIN} characters`,
      maxlength: `Client last names must be less than ${VALIDATION_CONSTANTS.NAME_MAX} characters`,
    },
  },
  {
    controlName: 'personalNumber',
    inputType: 'number',
    label: 'Personal number',
    errorMessageMapping: {
      maxlength: `Client personal numbers must consist of no more than ${VALIDATION_CONSTANTS.PERS_NUM_LENGTH} digits`,
      invalidLength: `Client personal numbers must consist of ${VALIDATION_CONSTANTS.PERS_NUM_LENGTH} digits`,
    },
  },
  {
    controlName: 'mobileNumber',
    inputType: 'number',
    label: 'Mobile number',
    errorMessageMapping: {
      pattern: 'Client mobile numbers must start with 5',
      maxlength: `Client mobile numbers must be no more than ${VALIDATION_CONSTANTS.MOB_NUM_LENGTH} digits`,
      invalidLength: `Client mobile numbers must be ${VALIDATION_CONSTANTS.MOB_NUM_LENGTH} digits`,
    },
  },
];
