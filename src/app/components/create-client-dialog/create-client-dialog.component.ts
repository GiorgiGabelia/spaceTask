import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { ClientFormComponent } from '../client-form/client-form.component';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { FilterForm } from '../client-form/models';

@Component({
  selector: 'app-create-client-dialog',
  imports: [
    MatIcon,
    MatDivider,
    MatDialogClose,
    ReactiveFormsModule,
    ClientFormComponent,
    MatButton,
    NgClass,
  ],
  templateUrl: './create-client-dialog.component.html',
})
export class CreateClientDialogComponent {
  private readonly matDialogRef = inject(MatDialogRef);

  createClientForm: FormGroup<{
    profilePictureURL: FormControl<string | null>;
    clientFormGroup?: FormGroup<FilterForm>;
  }> = new FormGroup({
    profilePictureURL: new FormControl<string | null>(null),
  });

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.createClientForm.patchValue({
          profilePictureURL: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  clearAll() {
    this.createClientForm.reset();
  }

  onSubmit() {
    this.matDialogRef.close({
      avatar: this.createClientForm.value.profilePictureURL,
      ...this.createClientForm.value.clientFormGroup,
    });
  }
}
