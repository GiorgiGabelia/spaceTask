import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { of, switchMap } from 'rxjs';
import { selectClientById } from '../../state/client/client.selectors';
import { AsyncPipe } from '@angular/common';
import { ClientFormComponent } from '../../components/client-form/client-form.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Client } from '../../state/client/client.model';
import { FilterFormValues } from '../../components/client-form/models';
import { ClientActions } from '../../state/client/client.actions';

@Component({
  selector: 'app-client-dashboard',
  imports: [
    AsyncPipe,
    ClientFormComponent,
    MatTabsModule,
    MatIcon,
    MatButtonModule,
  ],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.scss',
})
export class ClientDashboardComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  client$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      return id ? this.store.select(selectClientById(id)) : of(null);
    }),
  );

  updateClient(value: FilterFormValues, clientId: string) {
    const client: Client = {
      id: clientId,
      ...value,
    } as Client;
    this.store.dispatch(ClientActions.updateClient({ client }));
  }
}
