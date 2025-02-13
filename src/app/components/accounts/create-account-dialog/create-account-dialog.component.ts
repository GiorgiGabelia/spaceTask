import { Component, Inject, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { AccountType, Currency } from '../../../state/account/account.model';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { LowerCasePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';

export interface CreateAccountDialogData {
  type: AccountType;
  currencies: Currency[];
}

type CreateAccountForm = {
  [curency in Currency]?: FormControl<boolean | null>;
};

@Component({
  selector: 'app-create-account-dialog',
  imports: [
    MatIcon,
    MatDivider,
    LowerCasePipe,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDialogClose,
    MatButton,
  ],
  templateUrl: './create-account-dialog.component.html',
})
export class CreateAccountDialogComponent {
  readonly form?: FormGroup<CreateAccountForm>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: CreateAccountDialogData) {
    this.form = new FormGroup<CreateAccountForm>({});

    data.currencies.forEach((currency) =>
      this.form?.addControl(currency, new FormControl<boolean | null>(false)),
    );
  }
}
