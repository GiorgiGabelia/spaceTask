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
import { SessionStorageService } from '../../services/session-storage.service';

export interface PageAndSortChange {
  currentIndex: number;
  currentSortState?: Sort;
}

@Component({
  selector: 'app-clients',
  imports: [MatButton, AsyncPipe, GenericTableComponent, MatIcon],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent {
  private readonly store = inject(Store);
  private readonly sessionStorageService = inject(SessionStorageService);

  private readonly PAGE_SIZE = 5;

  private readonly pageAndSortChange$ = new BehaviorSubject<PageAndSortChange>(
    this.sessionStorageService.loadStateFromSessionStorage(),
  );

  readonly clients$ = this.pageAndSortChange$.pipe(
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
          } else {
            this.sessionStorageService.saveStateToSessionStorage({
              page: currentIndex,
              sort,
            });
          }
        }),
        map((clientSlice) => this.mapClientToTableRow(clientSlice)),
      ),
    ),
  );

  onPageChange(pageEvent: { currentIndex: number }) {
    this.pageAndSortChange$.next({
      currentIndex: pageEvent.currentIndex,
      currentSortState: this.pageAndSortChange$.value.currentSortState,
    });
  }

  onSortChange(sortEvent: Sort) {
    this.pageAndSortChange$.next({
      currentIndex: this.pageAndSortChange$.value.currentIndex,
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
      paging: {
        pageIndex: this.pageAndSortChange$.value.currentIndex - 1,
        totalItems: clientSlice.totalItems || 0,
        pageSize: clientSlice.pageSize || 0,
      },
      sort: this.pageAndSortChange$.value.currentSortState,
    };
  }
}
