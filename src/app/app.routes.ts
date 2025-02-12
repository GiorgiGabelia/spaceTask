import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('./pages/client-dashboard/client-dashboard.component').then(
        (m) => m.ClientDashboardComponent,
      ),
  },
];
