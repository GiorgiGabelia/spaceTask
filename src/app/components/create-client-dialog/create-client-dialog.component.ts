import { Component, inject } from '@angular/core';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { ClientFormComponent } from '../client-form/client-form.component';
import { FilterFormValues } from '../client-form/models';

@Component({
  selector: 'app-create-client-dialog',
  imports: [MatIcon, MatDivider, MatDialogClose, ClientFormComponent],
  templateUrl: './create-client-dialog.component.html',
})
export class CreateClientDialogComponent {
  private readonly matDialogRef = inject(MatDialogRef);

  onSubmit(formValues: FilterFormValues) {
    this.matDialogRef.close(formValues);
  }
}
