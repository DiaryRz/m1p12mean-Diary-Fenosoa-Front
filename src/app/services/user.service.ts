import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';

import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { CookieService } from 'ngx-cookie-service';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient/* , private cookieService: CookieService */) { }

  private httpOptions = {
      withCredentials : true,
      HttpOnly        : true,
  };

  getCurrentUser():Observable<any> {
    /* const user_id = this.cookieService.get('userId');
    console.log(user_id);
    return this.http.get<any>(`${this.apiUrl}/${user_id}`).pipe( */
    return this.http.get<any>(`${this.apiUrl}/user_002`).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error.error}); // This is your fallback value
      })
    );
  }
}
