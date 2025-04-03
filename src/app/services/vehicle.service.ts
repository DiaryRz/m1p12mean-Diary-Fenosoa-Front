import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';

import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private apiUrl = `${environment.apiUrl}/car`;
  constructor(private http: HttpClient) { }

  private httpOptions = {
      withCredentials : true,
  };

  addVehicle(carData: any):Observable<any> {
    return this.http.post(`${this.apiUrl}` , carData).pipe(
      catchError((error: HttpErrorResponse) => {
        //console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  listVehicles(client_id: String):Observable<any> {
    return this.http.get(`${this.apiUrl}/client/${client_id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        //console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  listClientVehicles(user_id: String):Observable<any> {
    return this.http.get(`${this.apiUrl}/client/${user_id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        //console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  getByPlate(immatriculation: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/plate`, {immatriculation: immatriculation}).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
    );
  }
}
