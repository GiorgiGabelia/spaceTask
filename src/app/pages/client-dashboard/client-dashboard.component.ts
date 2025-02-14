import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ClientFormComponent } from '../../components/client-form/client-form.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Client } from '../../state/client/client.model';
import { ClientFormValues } from '../../components/client-form/models';
import { ClientActions } from '../../state/client/client.actions';
import { MatDialog } from '@angular/material/dialog';
import {
  GenericDialogComponent,
  GenericDialogData,
} from '../../components/generic-dialog/generic-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountsComponent } from '../../components/accounts/accounts.component';

@Component({
  selector: 'app-client-dashboard',
  imports: [
    AsyncPipe,
    ClientFormComponent,
    MatTabsModule,
    MatIcon,
    MatButtonModule,
    AccountsComponent,
  ],
  templateUrl: './client-dashboard.component.html',
})
export class ClientDashboardComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly matDialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  readonly client$ = this.route.data.pipe(map((data) => data['client']));

  updateClient(value: ClientFormValues, clientId: string) {
    const client: Client = {
      id: clientId,
      ...value,
    } as Client;
    this.store.dispatch(ClientActions.updateClient({ client }));
  }

  openCancelDialog(id: string) {
    const data: GenericDialogData = {
      title: 'Delete client',
      content: 'Are you sure you want to delete this client?',
      acceptWording: 'Delete',
    };

    const dialogRef = this.matDialog.open(GenericDialogComponent, {
      data,
    });

    dialogRef
      .afterClosed()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((res?: boolean) => {
        if (res) {
          this.store.dispatch(ClientActions.deleteClient({ id }));
        }
      });
  }
}
