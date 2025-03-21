import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './login/login.component';
import { AppSideRegisterComponent } from './register/register.component';
import { ManagerGuard } from './manager.guard';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
        data :{ roles:[ "role_002" ]}
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
        data :{ roles:[ "role_002" ]}
      },
      {
        path: 'employee/login',
        component: AppSideLoginComponent,
        data :{ roles:["role_001", "role_003"]}
      },
    ],
  },
];
