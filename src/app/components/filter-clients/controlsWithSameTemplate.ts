import { FilterForm } from './models';

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
      minlength: 'Client names are more then 2 characters',
      maxlength: 'Client names are less then 50 characters',
    },
  },
  {
    controlName: 'lastName',
    inputType: 'string',
    label: 'Last name',
    errorMessageMapping: {
      invalidInput: 'Please use only English or only Georgian characters.',
      minlength: 'Client last names are more then 2 characters',
      maxlength: 'Client last names are less then 50 characters',
    },
  },
  {
    controlName: 'personalNumber',
    inputType: 'number',
    label: 'Personal number',
    errorMessageMapping: {
      maxlength: 'Client personal numbers consists of 11 digits',
    },
  },
  {
    controlName: 'mobileNumber',
    inputType: 'number',
    label: 'Mobile number',
    errorMessageMapping: {
      pattern: 'Client mobile numbers start with 5',
      maxlength: 'Client mobile numbers are less then 9 digits',
    },
  },
];
