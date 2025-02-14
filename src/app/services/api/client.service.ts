import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Client } from '../../state/client/client.model';
import { Sort } from '@angular/material/sort';
import { ClientSlice } from './models';
import { ClientFormValues } from '../../components/client-form/models';
import { environment as env } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly http = inject(HttpClient);

  private readonly clientsPath = '/clients';

  getClients(params: {
    page: number;
    pageSize: number;
    sort?: Sort;
    filters?: ClientFormValues;
  }): Observable<ClientSlice> {
    let httpParams = new HttpParams({
      fromObject: {
        _page: params.page,
        _limit: params.pageSize,
      },
    });

    const usedFilters: string[] = [];

    if (params.filters) {
      const filterKeys = Object.keys(
        params.filters,
      ) as (keyof ClientFormValues)[];

      filterKeys.forEach((key) => {
        if (params.filters![key]) {
          if (key === 'addresses') {
            const {
              httpParams: addressHttpParams,
              usedFilters: addressFilters,
            } = this.parseAndAppendAddressToGetRequest(
              httpParams,
              params.filters!.addresses,
            );

            addressFilters.forEach((filter) => usedFilters.push(filter));
            httpParams = addressHttpParams;
          } else {
            usedFilters.push(key);
            httpParams = this.appendHttpParams(
              httpParams,
              key + (key === 'sex' ? '' : '_like'),
              String(params.filters![key]),
            );
          }
        }
      });
    }

    if (params.sort?.direction) {
      httpParams = httpParams
        .append('_sort', params.sort.active)
        .append('_order', params.sort.direction);
    }

    return this.http
      .get(env.apiBaseUrl + this.clientsPath, {
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
          filters: usedFilters,
        })),
      );
  }

  getClient(id: string) {
    return this.http
      .get(`${env.apiBaseUrl}${this.clientsPath}/${id}`)
      .pipe(map((client) => client as Client));
  }

  createClient(client: Omit<Client, 'id'>) {
    return this.http
      .post(env.apiBaseUrl + this.clientsPath, client)
      .pipe(map((client) => client as Client));
  }

  updateClient(client: Client) {
    return this.http
      .put(`${env.apiBaseUrl + this.clientsPath}/${client.id}`, client)
      .pipe(map((client) => client as Client));
  }
  deleteClient(id: string) {
    return this.http.delete(`${env.apiBaseUrl + this.clientsPath}/${id}`);
  }

  private appendHttpParams(httpParams: HttpParams, param: string, val: string) {
    return httpParams.append(param, val);
  }

  private parseAndAppendAddressToGetRequest(
    httpParams: HttpParams,
    addresses: ClientFormValues['addresses'],
  ) {
    const addressTypes = ['factual', 'juridical'] as const;
    const usedFilters: string[] = [];

    for (const type of addressTypes) {
      const { city, country } = addresses[type];

      if (city) {
        httpParams = this.appendHttpParams(
          httpParams,
          `addresses.${type}.city_like`,
          String(city),
        );
        usedFilters.push(`addresses.${type}.city`);
      }

      if (country) {
        httpParams = this.appendHttpParams(
          httpParams,
          `addresses.${type}.country_like`,
          String(country),
        );
        usedFilters.push(`addresses.${type}.country`);
      }
    }

    return { httpParams, usedFilters };
  }
}
