import { inject, Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Client } from '../../state/client/client.model';
import { Sort } from '@angular/material/sort';
import { ClientSlice } from './models';
import { FilterFormValues } from '../../components/client-form/models';

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
    filters?: FilterFormValues;
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
      ) as (keyof FilterFormValues)[];

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
          filters: usedFilters,
        })),
      );
  }

  getClient(id: string) {
    return this.http
      .get(this.ROOT_URL + this.clientsPath + `/${id}`)
      .pipe(map((client) => client as Client));
  }

  createClient(client: Omit<Client, 'id'>) {
    return this.http
      .post(this.ROOT_URL + this.clientsPath, client)
      .pipe(map((client) => client as Client));
  }

  updateClient(client: Client) {
    return this.http
      .put(this.ROOT_URL + this.clientsPath + `/${client.id}`, client)
      .pipe(map((client) => client as Client));
  }

  deleteClient(id: string) {
    return this.http.delete(this.ROOT_URL + this.clientsPath + `/${id}`);
  }

  private appendHttpParams(httpParams: HttpParams, param: string, val: string) {
    return httpParams.append(param, val);
  }

  //TODO: refactor this:
  private parseAndAppendAddressToGetRequest(
    httpParams: HttpParams,
    addresses: FilterFormValues['addresses'],
  ) {
    const { city: factCity, country: factCountry } = addresses.factual;
    const { city: jurCity, country: jurCountry } = addresses.juridical;
    const usedFilters: string[] = [];

    if (factCity) {
      httpParams = this.appendHttpParams(
        httpParams,
        'addresses.factual.city_like',
        String(addresses.factual.city),
      );
      usedFilters.push('addresses.factual.city');
    }

    if (factCountry) {
      httpParams = this.appendHttpParams(
        httpParams,
        'addresses.factual.country_like',
        String(addresses.factual.country),
      );
      usedFilters.push('addresses.factual.country');
    }

    if (jurCity) {
      httpParams = this.appendHttpParams(
        httpParams,
        'addresses.juridical.city_like',
        String(addresses.juridical.city),
      );
      usedFilters.push('addresses.juridical.city');
    }

    if (jurCountry) {
      httpParams = this.appendHttpParams(
        httpParams,
        'addresses.juridical.country_like',
        String(addresses.juridical.country),
      );
      usedFilters.push('addresses.juridical.country');
    }

    return { httpParams, usedFilters };
  }
}
