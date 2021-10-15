import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';

import { Incidents } from '../../shared/interfaces/incidents.interface';
import { Equipment } from './../../shared/interfaces/equipment.interface';
import { api } from '../../../config';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  apiUrl = api.SERVER_URL;
  incidents: Observable<Incidents[]>;
  equipments: Observable<Equipment[]>;

  constructor(private httpClient: HttpClient) {
    this.incidents = this.getAllIncidents();
    this.equipments = this.getAllEquipments();
   }

   getAllIncidents(): Observable<Incidents[]> {
    return this.httpClient.get<Incidents[]>(`${this.apiUrl}/incidents/all`)
  }
 
  getAllEquipments(): Observable<Equipment[]> {
    return this.httpClient.get<Equipment[]>(`${this.apiUrl}/equipments/all`)
  }

}
