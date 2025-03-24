import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';

import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = `${environment.apiUrl}/car`;
  constructor(private http: HttpClient) { }

  private httpOptions = {
      withCredentials : true,
  };

  addCar(carData: any):Observable<any> {
    return this.http.post(`${this.apiUrl}` , carData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  listCars(client_id: String):Observable<any> {
    return this.http.get(`${this.apiUrl}/client/${client_id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  listClientCars(client_id: String):Observable<any> {
    return this.http.get(`${this.apiUrl}/client/${client_id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

}
