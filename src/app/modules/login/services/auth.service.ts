import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { catchError} from 'rxjs/operators';

import { api } from '../../../config';
import { User } from '../../shared/interfaces/users.interface'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
 apiUrl = api.SERVER_URL;
 token: any;

  constructor(private httpClient: HttpClient) { 
   
  }

  login(email: string, password: string) {
    return this.httpClient.post(`${this.apiUrl}/users/login`, {email, password});
    // .pipe(
    //   catchError(this.handleError('login', []))
    // );
   }

   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
            console.error(error); // log to console instead
            return of(result as T);  // Let the app keep running by returning an empty result.
    };
  }

 

   saveToken(token: string) {
    localStorage.setItem('mean-token', token);
    sessionStorage.setItem('mean-token',token);
    this.token = token;
  }

 
  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
      if (!this.token) {
        this.token = sessionStorage.getItem('mean-token');
      }
    }
    return this.token;
  }

  isAuthenticated(){
    return this.token != null;
  }
  
}
