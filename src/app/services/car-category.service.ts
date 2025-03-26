import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';

import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CarCategoryService {
  private apiUrl = `${environment.apiUrl}/car_category`;
  constructor(private http: HttpClient) { }

  private httpOptions = {
      withCredentials : true,
  };

  getCarCategory(id: string) :Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }
  listCarCategories() :Observable<any> {
    return this.http.get(`${this.apiUrl}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        return of({error : error.error}); // This is your fallback value
      })
    );
  }
}
