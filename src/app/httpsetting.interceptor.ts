import { HttpInterceptorFn, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const HttpSettingInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const cookie = cookieService.getAll()
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const x_cookie = `accessToken=${accessToken}; refreshToken=${refreshToken}`;
  const authReq = req.clone({
    withCredentials: true,
    headers: new HttpHeaders({
      'Authorization': `bearer ${accessToken}`,
      'x-cookie': x_cookie,
    })
  });

  return next(authReq);
};
