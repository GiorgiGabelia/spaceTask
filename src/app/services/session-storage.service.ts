import { Injectable } from '@angular/core';
import { PageAndSortState } from '../pages/clients/clients.component';
import { Sort } from '@angular/material/sort';
import { ClientFormValues } from '../components/client-form/models';
import { isEqual } from 'lodash';

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

  readFiltersStateFromSession(): ClientFormValues | undefined {
    const filters = sessionStorage.getItem('filters');
    return filters ? JSON.parse(filters) : undefined;
  }

  saveStateToSessionStorage(state: {
    page: number;
    sort?: Sort;
    filters?: ClientFormValues;
  }) {
    const keys = Object.keys(state) as (keyof typeof state)[];

    keys.forEach((key) => {
      if (state[key]) {
        sessionStorage.setItem(key, JSON.stringify(state[key]));
      }
    });
  }

  wereFiltersUpdated(newFilters: ClientFormValues) {
    const oldFilters = this.readFiltersStateFromSession();
    return !oldFilters ? true : isEqual(newFilters, oldFilters);
  }

  generateBlankFiltersObject(): ClientFormValues {
    return {
      addresses: {
        factual: {
          city: null,
          country: null,
        },
        juridical: {
          city: null,
          country: null,
        },
      },
      clientNumber: null,
      lastName: null,
      mobileNumber: null,
      name: null,
      personalNumber: null,
      sex: null,
    };
  }
}
