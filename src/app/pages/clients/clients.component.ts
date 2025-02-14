import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BehaviorSubject, map, switchMap, take, tap } from 'rxjs';
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
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ClientFormValues } from '../../components/client-form/models';
import { FilterClientsDialogComponent } from '../../components/filter-clients-dialog/filter-clients-dialog.component';
import { CreateClientDialogComponent } from '../../components/create-client-dialog/create-client-dialog.component';
import { Router } from '@angular/router';
import { MiniFilterFormComponent } from '../../components/mini-filter-form/mini-filter-form.component';

export interface PageAndSortState {
  currentIndex: number;
  currentSortState?: Sort;
}

@Component({
  selector: 'app-clients',
  imports: [
    MatButton,
    AsyncPipe,
    GenericTableComponent,
    MatIcon,
    MiniFilterFormComponent,
  ],
  templateUrl: './clients.component.html',
})
export class ClientsComponent {
  private readonly store = inject(Store);
  private readonly sessionStorageService = inject(SessionStorageService);
  private readonly matDialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  private readonly PAGE_SIZE = 10;

  private readonly DIALOG_CONFIG = {
    width: '40rem',
    maxHeight: '90vh',
    autoFocus: false,
  };

  private readonly pageAndSortState$ = new BehaviorSubject<PageAndSortState>(
    this.sessionStorageService.readPageAndSortStateFromSession(),
  );

  readonly clients$ = this.pageAndSortState$.pipe(
    switchMap(({ currentIndex, currentSortState }) =>
      this.store.select(selectClientSlice(currentIndex)).pipe(
        tap(({ clients, sort }) => {
          const pageNotYetFetched = !clients;
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
        map((clientSlice) => this.mapClientsToTable(clientSlice)),
      ),
    ),
  );

  changePage(pageEvent: { currentIndex: number }) {
    this.pageAndSortState$.next({
      currentIndex: pageEvent.currentIndex,
      currentSortState: this.pageAndSortState$.value.currentSortState,
    });
  }

  changeSort(sortEvent: Sort) {
    this.pageAndSortState$.next({
      currentIndex: this.pageAndSortState$.value.currentIndex,
      currentSortState: sortEvent,
    });
  }

  navigateToClientDashboard(res: { id: string }) {
    this.router.navigate(['/client', res.id]);
  }

  openFilterDialog() {
    const dialogRef = this.matDialog.open(
      FilterClientsDialogComponent,
      this.DIALOG_CONFIG,
    );

    dialogRef
      .afterClosed()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((formValues?: ClientFormValues) => {
        if (formValues) {
          this.loadClientsWithFilters(formValues);
        }
      });
  }

  addNameAndLastNameFilters(miniFilter: { name: string | null }) {
    const existingFilters =
      this.sessionStorageService.readFiltersStateFromSession() ||
      this.sessionStorageService.generateBlankFiltersObject();

    this.loadClientsWithFilters({
      ...existingFilters,
      name: miniFilter.name,
    });
  }

  openCreateClientDialog() {
    const dialogRef = this.matDialog.open(
      CreateClientDialogComponent,
      this.DIALOG_CONFIG,
    );

    dialogRef
      .afterClosed()
      .pipe(take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((client?: Client) => {
        if (client) {
          this.store.dispatch(ClientActions.addClient({ client }));
        }
      });
  }

  private mapClientsToTable(clientSlice: {
    clients: Client[] | null;
    totalItems: number | undefined;
    pageSize: number | undefined;
  }): GenericTable {
    return {
      rows:
        clientSlice.clients?.map((client) => ({
          clientNumber: client.clientNumber,
          name: client.name,
          lastName: client.lastName,
          sex: client.sex,
          personalNumber: client.personalNumber,
          mobileNumber: client.mobileNumber,
          id: client.id,
        })) || [],
      columns: [
        'clientNumber',
        'name',
        'lastName',
        'sex',
        'personalNumber',
        'mobileNumber',
      ],
      paging: {
        pageIndex: this.pageAndSortState$.value.currentIndex - 1,
        totalItems: clientSlice.totalItems || 0,
        pageSize: clientSlice.pageSize || 0,
      },
      sort: this.pageAndSortState$.value.currentSortState,
    };
  }

  private loadClientsWithFilters(filters: ClientFormValues) {
    this.changePage({ currentIndex: 1 });

    this.store.dispatch(
      ClientActions.loadClients({
        pageSize: this.PAGE_SIZE,
        page: this.pageAndSortState$.value.currentIndex,
        sort: this.pageAndSortState$.value.currentSortState,
        filters,
      }),
    );
  }
}
