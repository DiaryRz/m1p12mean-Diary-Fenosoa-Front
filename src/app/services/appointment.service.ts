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

  listAppointments(option: { with_dates?: boolean , verified?: boolean , waiting?: boolean}):Observable<any> {

    const userId: string = localStorage.getItem('userId') || '';
    console.log(userId);
    let endpoint;
    if(option.waiting == true){
      endpoint = this.apiUrl + "/waiting/" + userId;
    }
    else if(option.verified == true){
      endpoint = this.apiUrl + "/verified/" + userId;
    }
    else if(option.with_dates == true){
      endpoint = this.apiUrl + "/pending-with-date";
    }
    else{
      endpoint = this.apiUrl;
    }
    console.log(endpoint);
    return this.http.get(endpoint).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  listClientAppointments(client_id: string):Observable<any> {

    return this.http.get(`${this.apiUrl}/client/${client_id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  confirmAppointment(id_appointment: string){
    return this.http.post(`${this.apiUrl}/confirm` , { id_appointment:id_appointment }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  addDate(id_appointment: string , date_appointment: Date){
    return this.http.post(`${this.apiUrl}/adddate` , { date_appointment: date_appointment ,id_appointment:id_appointment }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }
}
