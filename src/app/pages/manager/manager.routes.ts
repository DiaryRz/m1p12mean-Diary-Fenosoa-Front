import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './history/history.component';
import { AppointementComponent } from './appointment/appointment.component'

export const PagesRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'employee',
        loadChildren: () =>
          import('./employee/employee.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'appointment',
        component: AppointementComponent,
      },
      {
        path: 'history',
        component: HistoryComponent,
      }
    ],
  },
];
