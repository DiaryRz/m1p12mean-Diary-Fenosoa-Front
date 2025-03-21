import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';

import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient ) { }

  listServices(): Observable<any>{
    return this.http.get(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  addService(ServiceData:any ): Observable<any>{
    return this.http.post(this.apiUrl, ServiceData).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
    );
  }


}
