import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';

import { api } from '../../../config';
import { User } from '../../shared/interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiUrl = api.SERVER_URL;
  users: Observable<User[]>;

  constructor(private httpClient: HttpClient) { 
    this.users = this.getAllUser()
  }

  getAllUser(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/users/all`)
  }
 

  addNewUser(user: User): Observable<User>{
    return this.httpClient.post<User>(`${this.apiUrl}/users/create`,user)
   
  }
  
  editUser(user: User){
    let id = user.id;
    return this.httpClient.put(`${this.apiUrl}/users/update/${id}`,user)
   
  }

}

