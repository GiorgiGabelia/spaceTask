import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BehaviorSubject, map, switchMap, tap } from 'rxjs';
import {
  GenericTableComponent,
  GenericTable,
} from '../../components/generic-table/generic-table.component';
import { Store } from '@ngrx/store';
import { selectClientSlice } from '../../state/client/client.selectors';
import { ClientActions } from '../../state/client/client.actions';
import { Client } from '../../state/client/client.model';
import { MatIcon } from '@angular/material/icon';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-clients',
  imports: [MatButton, AsyncPipe, GenericTableComponent, MatIcon],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent {
  private readonly store = inject(Store);

  private readonly pageOrSortChange$ = new BehaviorSubject<{
    currentIndex: number;
    currentSortState?: Sort;
  }>({ currentIndex: 1 });

  readonly PAGE_SIZE = 5;

  readonly clients$ = this.pageOrSortChange$.pipe(
    switchMap(({ currentIndex, currentSortState }) =>
      this.store.select(selectClientSlice(currentIndex)).pipe(
        tap(({ clients, sort }) => {
          const pageNotYetFetched = !clients.length;
          const sortChanged =
            sort?.active !== currentSortState?.active ||
            sort?.direction !== currentSortState?.direction;

          if (sortChanged || pageNotYetFetched) {
            this.store.dispatch(
              ClientActions.loadClients({
                page: currentIndex,
                pageSize: this.PAGE_SIZE,
                sort: currentSortState,
              }),
            );
          }
        }),
        map((clientSlice) => this.mapClientToTableRow(clientSlice)),
      ),
    ),
  );

  onPageChange(pageEvent: { currentIndex: number }) {
    this.pageOrSortChange$.next({
      currentIndex: pageEvent.currentIndex,
      currentSortState: this.pageOrSortChange$.value.currentSortState,
    });
  }

  onSortChange(sortEvent: Sort) {
    this.pageOrSortChange$.next({
      currentIndex: this.pageOrSortChange$.value.currentIndex,
      currentSortState: sortEvent,
    });
  }

  private mapClientToTableRow(clientSlice: {
    clients: Client[];
    totalItems: number | undefined;
    pageSize: number | undefined;
  }): GenericTable {
    return {
      data: clientSlice.clients.map((client) => ({
        clientNumber: client.clientNumber,
        name: client.name,
        lastName: client.lastName,
        sex: client.sex,
        personalNumber: client.personalNumber,
      })),
      columns: ['clientNumber', 'name', 'lastName', 'sex', 'personalNumber'],
      totalItems: clientSlice.totalItems || 0,
      pageSize: clientSlice.pageSize || 0,
    };
  }
}
