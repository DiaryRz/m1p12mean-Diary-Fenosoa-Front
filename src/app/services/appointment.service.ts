import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';

import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointment`;
  constructor(private http: HttpClient) { }

  private httpOptions = {
      withCredentials : true,
  };

  createAppointment(appointmentData: any):Observable<any> {
    return this.http.post(`${this.apiUrl}` , appointmentData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  listTakenDates(startDate: string , endDate: string):Observable<any> {
    return this.http.get(`${this.apiUrl}/dates/occupees?startDate=${startDate}&endDate=${endDate}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  listAppointments():Observable<any> {

    return this.http.get(`${this.apiUrl}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  listClientAppointments(client_id: String):Observable<any> {

    return this.http.get(`${this.apiUrl}/client/${client_id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }
}
