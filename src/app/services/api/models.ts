import { Sort } from '@angular/material/sort';
import { Client } from '../../state/client/client.model';

export interface ClientSlice {
  clients: Client[];
  page: number;
  pageSize: number;
  totalItems: number;
  sort?: Sort;
  filters: string[];
}
