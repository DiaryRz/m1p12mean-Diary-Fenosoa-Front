import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: EmployeeListComponent,
    children: [
      {
      }
    ],
  },
];

