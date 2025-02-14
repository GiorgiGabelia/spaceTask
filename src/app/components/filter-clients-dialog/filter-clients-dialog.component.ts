import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClientFormValues } from '../client-form/models';
import { ClientFormComponent } from '../client-form/client-form.component';
import { SessionStorageService } from '../../services/session-storage.service';

@Component({
  selector: 'app-filter-clients-dialog',
  imports: [
    MatDialogClose,
    MatDivider,
    MatIcon,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    ClientFormComponent,
  ],
  templateUrl: './filter-clients-dialog.component.html',
})
export class FilterClientsDialogComponent {
  private readonly matDialog = inject(MatDialogRef);

  readonly formValues = inject(
    SessionStorageService,
  ).readFiltersStateFromSession();

  onSubmit(values: ClientFormValues) {
    this.matDialog.close(values);
  }
}
