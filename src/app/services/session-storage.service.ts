import { Injectable } from '@angular/core';
import { PageAndSortState } from '../pages/clients/clients.component';
import { Sort } from '@angular/material/sort';
import { FilterFormValues } from '../components/client-form/models';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  readPageAndSortStateFromSession(): PageAndSortState {
    const page = sessionStorage.getItem('page');
    const sort = sessionStorage.getItem('sort');
    return {
      currentIndex: page ? JSON.parse(page) : 1,
      currentSortState: sort ? JSON.parse(sort) : undefined,
    };
  }

  readFiltersStateFromSession(): FilterFormValues {
    const filters = sessionStorage.getItem('filters');
    return filters ? JSON.parse(filters) : undefined;
  }

  saveStateToSessionStorage(state: {
    page: number;
    sort?: Sort;
    filters?: FilterFormValues;
  }) {
    const keys = Object.keys(state) as (keyof typeof state)[];

    keys.forEach((key) => {
      if (state[key]) {
        sessionStorage.setItem(key, JSON.stringify(state[key]));
      }
    });
  }
}
