import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

export interface GenericDialogData {
  title: string;
  content: string;
  acceptWording?: string;
  cancelWording?: string;
}

@Component({
  selector: 'app-generic-dialog',
  imports: [MatIcon, MatDialogClose, MatButton],
  templateUrl: './generic-dialog.component.html',
})
export class GenericDialogComponent {
  readonly data: GenericDialogData = inject(MAT_DIALOG_DATA);
}
