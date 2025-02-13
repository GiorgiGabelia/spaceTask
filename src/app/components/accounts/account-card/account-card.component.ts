import { Component, DestroyRef, inject, input } from '@angular/core';
import { Account } from '../../../state/account/account.model';
import { LowerCasePipe, NgClass, TitleCasePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { GenericDialogComponent } from '../../generic-dialog/generic-dialog.component';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { AccountActions } from '../../../state/account/account.actions';

@Component({
  selector: 'app-account-card',
  imports: [LowerCasePipe, MatButton, NgClass, TitleCasePipe, MatIcon],
  templateUrl: './account-card.component.html',
})
export class AccountCardComponent {
  private readonly matDialog = inject(MatDialog);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);

  account = input.required<Account>();
  clientNumber = input.required<number>();

  openCloseDialog() {
    const dialogRef = this.matDialog.open(GenericDialogComponent, {
      data: {
        title: 'Close this account',
        content: 'Are you sure you want to close this account?',
        acceptWording: 'Close',
        cancelWording: 'Back',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((res?: boolean) => {
        if (res) {
          this.store.dispatch(
            AccountActions.closeAccount({
              accountType: this.account().type,
              clientNumber: this.clientNumber(),
              id: this.account().id,
            }),
          );
        }
      });
  }
}
