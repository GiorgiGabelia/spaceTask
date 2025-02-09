import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { dummyClients } from './dummy-data';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor() {}

  loadClients(params: { page: number; pageSize: number }) {
    return of(dummyClients);
  }
}
