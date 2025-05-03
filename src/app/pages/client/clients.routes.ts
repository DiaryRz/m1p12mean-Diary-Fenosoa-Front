import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppointmentsHistoryComponent } from './history/appointments.component';
import { AppointmentsComponent } from './appointments/appointments.component'
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
        component: AppointmentsComponent,
      },
      {
        path: 'history',
        component: AppointmentsHistoryComponent,
      }
    ],

  },
];
