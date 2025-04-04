import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';

import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class WorksService {
  private apiUrl = `${environment.apiUrl}/work`;
  constructor(private http: HttpClient) { }

  private httpOptions = {
      withCredentials : true,
  };

  createWork(id_user: string, id_appointment:string , id_service:string, begin: boolean  = false ):Observable<any> {
    return this.http.post(`${this.apiUrl}` , {id_user: id_user, id_appointment: id_appointment , id_service: id_service , begin: begin}).pipe(
      catchError((error: HttpErrorResponse) => {
        //console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }
 getByAppointmentId(id_appointment:string){
    return this.http.get(`${this.apiUrl}/appointment/${id_appointment}`).pipe(
    catchError((error: HttpErrorResponse) => {
      //console.log(error);
      return of({error : error.error}); // This is your fallback value
    })
    );
 }

 updateWork(work_id:string, work_data:any):Observable<any> {
    return this.http.put(`${this.apiUrl}/${work_id}` , work_data).pipe(
      catchError((error: HttpErrorResponse) => {
        //console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }


}
