import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import { api } from '../../../config';
import { User } from '../../shared/interfaces/users.interface';
import { Equipment } from '../../shared/interfaces/equipment.interface';
import { Incidents } from './../../shared/interfaces/incidents.interface';
import { Plans } from '../../shared/interfaces/plans.interface';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  apiUrl = api.SERVER_URL;
  users: Observable<User[]>;
  equipments: Observable<Equipment[]>;
  incidents: Observable<Incidents[]>;
  plans: Observable<Plans[]>;
  

  constructor(private httpClient: HttpClient) { 
    this.users = this.getAllUser();
    this.equipments = this.getAllEquipments();
    this.incidents = this.getAllIncidents();
    this.plans = this.getAllPlans();
    
  }

  getAllUser(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/users/all`)
      
     }

  getAllEquipments(): Observable<Equipment[]> {
      return this.httpClient.get<Equipment[]>(`${this.apiUrl}/equipments/all`)
    }

    getAllIncidents(): Observable<Incidents[]> {
      return this.httpClient.get<Incidents[]>(`${this.apiUrl}/incidents/all`)
    }

    getAllPlans(): Observable<Plans[]> {
      return this.httpClient.get<Plans[]>(`${this.apiUrl}/maintenancePlan/all`)
    }

    
}

