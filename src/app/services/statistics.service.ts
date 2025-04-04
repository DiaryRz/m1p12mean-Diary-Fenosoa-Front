import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = `${environment.apiUrl}/statistics`;
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getMonthlyAppointments(year: number,month: number){
    return this.http.get(`${this.apiUrl}/appointments-by-month?year=${year.toString()}${month > 0 ? '&month='+ month : ''}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
    );
  }
  getMonthlyRevenues(year: number,month: number){
    return this.http.get(`${this.apiUrl}/amount-by-month?year=${year.toString()}${month > 0 ? '&month='+ month : ''}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
    );
  }
  getMonthlyServices(year: number,month: number){
    return this.http.get(`${this.apiUrl}/services-by-month?year=${year.toString()}${month > 0 ? '&month='+ month : ''}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

}
