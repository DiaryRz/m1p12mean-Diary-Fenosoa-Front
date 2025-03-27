import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'employee',
        loadChildren: () =>
          import('./employee/employee.routes').then((m) => m.EmployeeRoutes),
      },
      {
        path: 'services',
        loadChildren: () =>
          import('./services/services.routes').then((m) => m.ServicesRoutes),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.routes').then((m) => m.ServicesRoutes),
      },
    ],
  },
];
