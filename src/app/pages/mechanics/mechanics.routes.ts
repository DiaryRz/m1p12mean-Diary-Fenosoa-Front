import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppointmentsComponent } from './appointments/appointments.component'
import { AppointmentsWorksComponent } from './works/works.component'

export const PagesRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'appointments',
        component: AppointmentsComponent,
      },
      {
        path: 'works',
        component: AppointmentsWorksComponent,
      },
    ],

  },
];
