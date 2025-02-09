import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import {
  GenericTableComponent,
  TableData,
} from '../../components/generic-table/generic-table.component';
import { Store } from '@ngrx/store';
import { selectClientSlice } from '../../state/client/client.selectors';
import { ClientActions } from '../../state/client/client.actions';
import { Client } from '../../state/client/client.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-clients',
  imports: [MatButton, AsyncPipe, GenericTableComponent, MatIcon],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent {
  private readonly store = inject(Store);

  private readonly pageChange$ = new BehaviorSubject({ currentIndex: 1 });

  readonly PAGE_SIZE = 5;

  readonly clients$ = this.pageChange$.pipe(
    switchMap(({ currentIndex }) =>
      this.store.select(selectClientSlice(currentIndex)).pipe(
        tap(({ clients }) => {
          if (!clients.length) {
            this.store.dispatch(
              ClientActions.loadClients({
                page: currentIndex,
                pageSize: this.PAGE_SIZE,
              }),
            );
          }
        }),
        map((clientSlice) => this.mapClientToTableRow(clientSlice)),
      ),
    ),
  );

  onPageChange(e: { currentIndex: number }) {
    this.pageChange$.next({ currentIndex: e.currentIndex });
  }

  private mapClientToTableRow(clientSlice: {
    clients: Client[];
    totalItems: number | undefined;
    pageSize: number | undefined;
  }): TableData {
    return {
      data: clientSlice.clients.map((client) => ({
        'Client number': client.clientNumber,
        Name: client.name,
        'Last name': client.lastName,
        Sex: client.sex,
        'Personal number': client.personalNumber,
      })),
      totalItems: clientSlice.totalItems || 0,
      pageSize: clientSlice.pageSize || 0,
    };
  }
}
