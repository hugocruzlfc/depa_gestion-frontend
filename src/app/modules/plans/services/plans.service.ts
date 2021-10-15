import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';

import { Plans } from '../../shared/interfaces/plans.interface';
import { api } from '../../../config';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  
  apiUrl = api.SERVER_URL;
   plans: Observable<Plans[]>;

  constructor(private httpClient: HttpClient) { 
   this.plans = this.getAllPlans();
  }

  getAllPlans(): Observable<Plans[]> {
    return this.httpClient.get<Plans[]>(`${this.apiUrl}/maintenancePlan/all/`)
  }

  addNewPlan(newPlan: Plans): Observable<Plans[]> {
    return this.httpClient.post<Plans[]>(`${this.apiUrl}/maintenancePlan/create`,newPlan )
  }

  editPlan(editPlan: Plans){
    let id = editPlan.id;
    return this.httpClient.put(`${this.apiUrl}/maintenancePlan/update/${id}`, editPlan)
  }

  toDone(currentPlan: Plans){
    let id = currentPlan.id;
    return this.httpClient.patch(`${this.apiUrl}/maintenancePlan/todone/${id}`,currentPlan)
  }

  deletePlan(id: number){
    return this.httpClient.delete(`${this.apiUrl}/maintenancePlan/delete/${id}`)
  }

}
