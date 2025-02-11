import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogClose } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
  selector: 'app-create-client-dialog',
  imports: [
    MatIcon,
    MatDivider,
    MatDialogClose,
    ReactiveFormsModule,
    ClientFormComponent,
  ],
  templateUrl: './create-client-dialog.component.html',
})
export class CreateClientDialogComponent {
  createClientForm = new FormGroup({
    test: new FormControl(true),
  });

  ngOnInit() {
    this.createClientForm.valueChanges.subscribe(console.log);
  }
}
