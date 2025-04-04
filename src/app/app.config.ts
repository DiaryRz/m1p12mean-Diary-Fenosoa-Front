import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

// perfect scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Datepicker
import { MAT_DATE_LOCALE,provideNativeDateAdapter } from '@angular/material/core';


// Cookies
import {CookieService} from 'ngx-cookie-service';

import { HTTP_INTERCEPTORS , withInterceptors } from '@angular/common/http';
import { HttpSettingInterceptor } from './httpsetting.interceptor';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


export const appConfig: ApplicationConfig = {
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    provideCharts(withDefaultRegisterables()),
    provideHttpClient( withInterceptors([HttpSettingInterceptor]) ),
    CookieService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withComponentInputBinding()
    ),
    provideHttpClient(withInterceptorsFromDi()),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      TablerIconsModule.pick(TablerIcons),
      NgScrollbarModule,
    ), provideCharts(withDefaultRegisterables()),
  ],
};
