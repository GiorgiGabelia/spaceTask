import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { map } from 'rxjs';
import {
  GenericTableComponent,
  TableData,
} from '../../components/generic-table/generic-table.component';
import { Store } from '@ngrx/store';
import { selectClients } from '../../state/client/client.selectors';
import { ClientActions } from '../../state/client/client.actions';
import { Client } from '../../state/client/client.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-clients',
  imports: [MatButton, AsyncPipe, GenericTableComponent, MatIcon],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent implements OnInit {
  private readonly store = inject(Store);

  readonly PAGE_SIZE = 5;

  readonly clients$ = this.store
    .select(selectClients)
    .pipe(map((clients) => this.mapClientToTableRow(clients)));

  ngOnInit() {
    this.store.dispatch(
      ClientActions.loadClients({ page: 0, pageSize: this.PAGE_SIZE }),
    );
  }

  private mapClientToTableRow(clients: Client[]): TableData[] {
    return clients.map((client) => ({
      'Client number': client.clientNumber,
      Name: client.name,
      'Last name': client.name,
      Sex: client.sex,
      'Personal number': client.personalNumber,
    }));
  }
}
