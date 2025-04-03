import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppointmentsComponent } from './appointments/appointments.component'

export const PagesRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'appointments',
        component: AppointmentsComponent,
      },
    ],

  },
];
