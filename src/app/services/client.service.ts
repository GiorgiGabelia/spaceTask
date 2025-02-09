import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Client } from '../state/client/client.model';
import { ClientSlice } from './models';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly http = inject(HttpClient);

  private readonly ROOT_URL = 'http://localhost:3000';

  private readonly clientsPath = '/clients';

  getClients(params: {
    page: number;
    pageSize: number;
  }): Observable<ClientSlice> {
    const httpParams = new HttpParams()
      .set('_page', params.page)
      .set('_limit', params.pageSize);

    return this.http
      .get(this.ROOT_URL + this.clientsPath, {
        params: httpParams,
        observe: 'response',
      })
      .pipe(
        map((res) => ({
          clients: res.body as Client[],
          page: params.page,
          pageSize: params.pageSize,
          totalItems: Number(res.headers.get('X-Total-Count')),
        })),
      );
  }
}
