import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeContentComponent } from './home-content.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: HomeContentComponent, // New component for root content
      },
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
          import('./settings/settings.routes').then((m) => m.SettingsRoutes),
      },
      {
        path: 'appointments',
        loadChildren: () =>
          import('./appointments/appointments.routes').then((m) => m.AppointmentsRoutes),
      },


    ],
  },
];
