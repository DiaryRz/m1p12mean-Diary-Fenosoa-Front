import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './history/history.component';
import { AppointementComponent } from './appointment/appointment.component'
import { CarsComponent } from './cars/cars.component'

export const PagesRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'cars',
        component: CarsComponent,
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
