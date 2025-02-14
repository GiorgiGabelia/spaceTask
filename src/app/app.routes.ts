import { Routes } from '@angular/router';
import { clientResolver } from './resolvers/client.resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'clients',
  },
  {
    path: 'clients',
    loadComponent: () =>
      import('./pages/clients/clients.component').then(
        (m) => m.ClientsComponent,
      ),
  },
  {
    path: 'client/:id',
    resolve: { client: clientResolver },
    loadComponent: () =>
      import('./pages/client-dashboard/client-dashboard.component').then(
        (m) => m.ClientDashboardComponent,
      ),
  },
];
