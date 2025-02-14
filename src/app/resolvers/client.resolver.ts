import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, first, switchMap, tap } from 'rxjs/operators';
import { Client } from '../state/client/client.model';
import { selectClientById } from '../state/client/client.selectors';
import { ClientActions } from '../state/client/client.actions';

export const clientResolver: ResolveFn<Client | null> = (
  route: ActivatedRouteSnapshot,
): Observable<Client | null> => {
  const store = inject(Store);
  const id = route.paramMap.get('id');

  if (!id) {
    return of(null);
  }

  return store.select(selectClientById(id)).pipe(
    tap((client) => {
      if (!client) {
        store.dispatch(ClientActions.loadClient({ id }));
      }
    }),
    filter((client): client is Client => !!client),
    first(),
  );
};
