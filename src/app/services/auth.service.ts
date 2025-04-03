import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
providedIn: 'root'
})


export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  constructor(private http: HttpClient) { }

  login(credentials:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/login`,credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error.error}); // This is your fallback value
      })
    );
  }

  logout():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/logout`).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error.error}); // This is your fallback value
      })
    );
  }

  register(body:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/register`,body).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error.error}); // This is your fallback value
      })
    );
  }

  refresh():Observable<any>{
    return this.http.get(`${this.apiUrl}/refresh`).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.error.success === false){
          return of({ok:false})
        }
          return of({ok:true})
      })
    )
  }
  verify():Observable<any>{
    return this.http.get(`${this.apiUrl}/protected`).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.error.success === false){
          return of({ok:false})
        }
          return of({ok:true})
      })
    )
  }
}
