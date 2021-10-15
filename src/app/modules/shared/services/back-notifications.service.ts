import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import { BackNotification } from '../../shared/interfaces/backNotifications.interface';
import { api } from '../../../config';


@Injectable({
  providedIn: 'root'
})
export class BackNotificationsService {
  apiUrl = api.SERVER_URL;
  backNotifications: Observable<BackNotification[]>;

  constructor(private httpClient: HttpClient) {
    this.backNotifications = this.getBackNotifications();
   }

   getBackNotifications(): Observable<BackNotification[]> {
    return this.httpClient.get<BackNotification[]>(`${this.apiUrl}/notifications/all`)
  }

   createBackNotifications(newBackNotification: BackNotification): Observable<BackNotification> {
    return this.httpClient.post<BackNotification>(`${this.apiUrl}/notifications/create`, newBackNotification);
  }

   deleteBackNotifications(id: number): Observable<BackNotification> {
    return this.httpClient.delete<BackNotification>(`${this.apiUrl}/notifications/delete/${id}`);
  }

}
