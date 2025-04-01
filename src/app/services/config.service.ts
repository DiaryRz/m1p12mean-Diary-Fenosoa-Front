import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';

import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private apiUrl = `${environment.apiUrl}/config`;
  constructor(private http: HttpClient) { }

  private httpOptions = {
      withCredentials : true,
  };

  addConfig(config: any):Observable<any> {
    return this.http.post(`${this.apiUrl}` , config).pipe(
      catchError((error: HttpErrorResponse) => {
        //console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

  getConfig():Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
    );
  }

}
