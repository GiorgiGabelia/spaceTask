import { Component, input } from '@angular/core';
import { Account } from '../../../state/account/account.model';
import { LowerCasePipe, NgClass, TitleCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-account-card',
  imports: [LowerCasePipe, MatButton, NgClass, TitleCasePipe, MatIcon],
  templateUrl: './account-card.component.html',
})
export class AccountCardComponent {
  account = input.required<Account>();
}
