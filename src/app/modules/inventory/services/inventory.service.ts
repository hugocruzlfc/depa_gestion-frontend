
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';

import { api } from '../../../config';
import { Equipment } from '../../shared/interfaces/equipment.interface';
import { Hardware } from './../../shared/interfaces/hardware.interface';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  apiUrl = api.SERVER_URL;
  hardware: Observable<Hardware[]>;
  equipments: Observable<Equipment[]>;

  constructor(private httpClient: HttpClient) { 
     this.hardware = this.getAllHardwares();
     this.equipments = this.getAllEquipments();
  }


  getAllEquipments(): Observable<Equipment[]> {
    return this.httpClient.get<Equipment[]>(`${this.apiUrl}/equipments/all`)
  }


  getAllHardwares(): Observable<Hardware[]> {
    return this.httpClient.get<Hardware[]>(`${this.apiUrl}/users/all`)
  }
 

  addNewEquipment(equipment: Equipment, hardwares: Hardware[]): Observable<Equipment>{
    return this.httpClient.post<Equipment>(`${this.apiUrl}/equipments/create`,{equipment,hardwares} )
   
  }
  
  editEquipment(equipment: Equipment,  hardwares: Hardware[]){
    let id = equipment.id;
    return this.httpClient.put(`${this.apiUrl}/equipments/update/${id}`,{equipment,hardwares})
   
  }



  addNewHardware(hardware: Hardware): Observable<Hardware>{
    return this.httpClient.post<Hardware>(`${this.apiUrl}/users/create`,hardware)
   
  }
  
  editHardware(hardware: Hardware){
    let id = hardware.id;
    return this.httpClient.put(`${this.apiUrl}/hardwares/update/${id}`,hardware);
  }

  getEquipmentById(id: number): Observable<Equipment>{
    return this.httpClient.get<Equipment>(`${this.apiUrl}/equipments/byid/${id}`)
  }
}
