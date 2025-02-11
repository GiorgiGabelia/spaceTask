import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogClose } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { ClientFormComponent } from '../client-form/client-form.component';
import { MatButton } from '@angular/material/button';
import { NgClass } from '@angular/common';

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
  createClientForm = new FormGroup({
    profilePicture: new FormControl<Blob | null>(null),
  });

  profilePictureUrl: string | null = null;

  ngOnInit() {
    this.createClientForm.valueChanges.subscribe(console.log);
  }

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      this.createClientForm.patchValue({
        profilePicture: file,
      });

      const reader = new FileReader();
      reader.onload = () => {
        this.profilePictureUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  clearAll() {
    this.createClientForm.reset();
  }
}
