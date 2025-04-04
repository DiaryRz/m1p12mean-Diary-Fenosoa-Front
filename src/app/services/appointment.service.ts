import { Injectable } from '@angular/core';
import { HttpClient , HttpParams , HttpErrorResponse } from '@angular/common/http';

import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { PaginatedResponse } from 'src/app/pages/pagination.interface'


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
        //console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  listTakenDates(startDate: string , endDate: string):Observable<any> {
    return this.http.get(`${this.apiUrl}/dates/occupees?startDate=${startDate}&endDate=${endDate}`).pipe(
      catchError((error: HttpErrorResponse) => {
        //console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  listAppointments(option: { with_dates?: boolean , verified?: boolean , waiting?: boolean} , body: any ,pagination?: { page: number , limit: number }):Observable<any> {

    const userId: string = localStorage.getItem('userId') || '';
    let endpoint;
    if(option.waiting == true){
      endpoint = this.apiUrl + "/waiting/" + userId;
      return this.http.get(endpoint).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
      );
    }
    if(option.verified == true){
      endpoint = this.apiUrl + "/verified/" + userId;
      return this.http.get(endpoint).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
      );
    }

    if(option.with_dates == true){
      endpoint = this.apiUrl + "/pending-with-date";
      return this.http.get(endpoint).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
      );

    }
    endpoint = this.apiUrl + "/get";

    let params = new HttpParams()
    if (pagination) {
      params.set('page', pagination.page.toString())
      .set('limit', pagination.limit.toString());

    }
    return this.http.post<PaginatedResponse<any>>(endpoint, { cond: body }, { params: params }).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
    );
    //console.log(endpoint);
  }

  listClientAppointments(client_id: string):Observable<any> {

    return this.http.get(`${this.apiUrl}/client/${client_id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        //console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  confirmAppointment(id_appointment: string){
    return this.http.post(`${this.apiUrl}/confirm` , { id_appointment:id_appointment }).pipe(
      catchError((error: HttpErrorResponse) => {
        //console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  addDate(id_appointment: string , date_appointment: Date){
    return this.http.post(`${this.apiUrl}/adddate` , { date_appointment: date_appointment ,id_appointment:id_appointment }).pipe(
      catchError((error: HttpErrorResponse) => {
        //console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  addDateDeposition(id_appointment:string){
    return this.http.put(`${this.apiUrl}/${id_appointment}/date-deposition`,{}).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  update(id_appointment:string, data:any){
    return this.http.put(`${this.apiUrl}/${id_appointment}`,data).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  delete(id_appointment:string){
    return this.http.delete(`${this.apiUrl}/${id_appointment}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

}
