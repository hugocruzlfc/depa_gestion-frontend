import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable } from 'rxjs';

import { Incidents } from '../../shared/interfaces/incidents.interface';
import { api } from '../../../config';

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {
 
  apiUrl = api.SERVER_URL;
 // incidents: Observable<Incidents[]>;

  constructor(private httpClient: HttpClient) { 
    // this.incidents = this.getAllIncidents();
  }

  getAllIncidentsByUser(userId: number): Observable<Incidents[]> {
    return this.httpClient.get<Incidents[]>(`${this.apiUrl}/incidents/all/${userId}`)
  }
  
  getAllIncidents(): Observable<Incidents[]> {
    return this.httpClient.get<Incidents[]>(`${this.apiUrl}/incidents/all`)
  }

  addNewIncident(newIncident: Incidents): Observable<Incidents[]> {
    return this.httpClient.post<Incidents[]>(`${this.apiUrl}/incidents/create`,newIncident )
  }

  editIncident(editIncident: Incidents){
    let id = editIncident.id;
    return this.httpClient.put(`${this.apiUrl}/incidents/update/${id}`, editIncident)
  }

  toAtention(currentIncident: Incidents){
    let id = currentIncident.id;
    return this.httpClient.patch(`${this.apiUrl}/incidents/toatention/${id}`,currentIncident)
  }

  deleteIncident(id: number){
    return this.httpClient.delete(`${this.apiUrl}/incidents/delete/${id}`)
  }

}
