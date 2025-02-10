import { Injectable } from '@angular/core';
import { PageAndSortChange } from '../pages/clients/clients.component';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  loadStateFromSessionStorage(): PageAndSortChange {
    const page = sessionStorage.getItem('page');
    const sort = sessionStorage.getItem('sort');
    return {
      currentIndex: page ? JSON.parse(page) : 1,
      currentSortState: sort ? JSON.parse(sort) : undefined,
    };
  }

  saveStateToSessionStorage(state: { page: number; sort?: Sort }) {
    const keys = Object.keys(state) as (keyof typeof state)[];

    keys.forEach((key) => {
      if (state[key]) {
        sessionStorage.setItem(key, JSON.stringify(state[key]));
      }
    });
  }
}
