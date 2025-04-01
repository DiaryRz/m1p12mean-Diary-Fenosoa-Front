import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';

import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient ) { }

  pay(data: any, half?: boolean): Observable<any>{
    return this.http.post(`${this.apiUrl}/${half ? 'moitie': 'total'}`, data).pipe(
      catchError((error: HttpErrorResponse) => {
        return of({error : error.error}); // This is your fallback value
      })
    );
  }
}
