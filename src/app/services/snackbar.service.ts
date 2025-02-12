import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly SNACKBAR_CONFIG = {
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    duration: 5000,
    data: {
      snackType: 'error',
    },
  };

  open(message: string, state?: 'FAIL' | 'SUCCESS') {
    this.snackBar.open(
      message + (state ? (state === 'FAIL' ? ' ❌' : ' ✅') : ''),
      'Close',
      this.SNACKBAR_CONFIG as MatSnackBarConfig,
    );
  }
}
