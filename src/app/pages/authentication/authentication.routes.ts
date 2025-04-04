import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './login/login.component';
import { AppSideRegisterComponent } from './register/register.component';
import { ManagerGuard } from './manager.guard';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'register',
        component: AppSideRegisterComponent,
        data :{ roles:[ "role_002" ]}
      },
      {
        path: 'login',
        component: AppSideLoginComponent,
        data :{ roles:[ "role_002" ]}
      },
      {
        path: 'login/client',
        component: AppSideLoginComponent,
        data :{ roles:[ "role_002" ]}
      },
      {
        path: 'login/manager',
        component: AppSideLoginComponent,
        data :{ roles:["role_001"]}
      },
      {
        path: 'login/mechanics',
        component: AppSideLoginComponent,
        data :{ roles:["role_003"]}
      },

    ],
  },
];
