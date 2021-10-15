import { ComunicationService } from './../../shared/services/comunication.service';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import { api } from '../../../config';
import { Equipment } from '../../shared/interfaces/equipment.interface';
import { Incidents } from './../../shared/interfaces/incidents.interface';
import { Plans } from '../../shared/interfaces/plans.interface';

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  apiUrl = api.SERVER_URL;
  incidents: Observable<Incidents[]>;
  currentUserId: number =0;

  constructor(private httpClient: HttpClient, private comunicationService:ComunicationService) { 
   
    this.comunicationService.customUserId.subscribe(userId => this.currentUserId = userId);
    this.incidents = this.getAllIncidents();
  }



    getAllIncidents(): Observable<Incidents[]> {
      return this.httpClient.get<Incidents[]>(`${this.apiUrl}/incidents/all/${this.currentUserId}`)
    }

   
}
