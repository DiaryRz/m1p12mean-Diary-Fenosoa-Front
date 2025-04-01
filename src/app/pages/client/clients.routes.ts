import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './history/history.component';
import { AppointementComponent } from './appointment/appointment.component'
import { VehiclesComponent } from './vehicles/vehicles.component'

export const PagesRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'vehicles',
        component: VehiclesComponent,
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
