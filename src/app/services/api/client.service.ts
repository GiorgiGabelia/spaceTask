import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Client } from '../../state/client/client.model';
import { Sort } from '@angular/material/sort';
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
    sort?: Sort;
  }): Observable<ClientSlice> {
    let httpParams = new HttpParams({
      fromObject: {
        _page: params.page,
        _limit: params.pageSize,
      },
    });

    if (params.sort?.direction) {
      httpParams = httpParams
        .append('_sort', params.sort.active)
        .append('_order', params.sort.direction);
    }

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
          sort: params.sort,
          totalItems: Number(res.headers.get('X-Total-Count')),
        })),
      );
  }
}
