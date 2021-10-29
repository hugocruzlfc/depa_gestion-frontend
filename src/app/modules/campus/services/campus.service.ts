import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable } from 'rxjs';

import { api } from '../../../config';
import { Faculty } from "../../shared/interfaces/facultys.interface";
import { Section } from "../../shared/interfaces/sections.interface";

@Injectable({
  providedIn: 'root'
})
export class CampusService {
  
  apiUrl = api.SERVER_URL;
  facultys: Observable<Faculty[]>;
  sections: Observable<Section[]>;

  constructor(private httpClient: HttpClient) {
    this.facultys = this.getAllFacultys();
    this.sections = this.getAllSections();
   }

  getAllFacultys(): Observable<Faculty[]> {
    return this.httpClient.get<Faculty[]>(`${this.apiUrl}/facultys/all`)
  }

  addNewFaculty(newFaculty: Faculty): Observable<Faculty[]> {
    return this.httpClient.post<Faculty[]>(`${this.apiUrl}/facultys/create`, newFaculty )
  }

  
  editFaculty(editFaculty: Faculty){
    let id = editFaculty.id;
    return this.httpClient.put(`${this.apiUrl}/facultys/update/${id}`, editFaculty)
  }

  deleteFaculty(id: number){
    return this.httpClient.delete(`${this.apiUrl}/facultys/delete/${id}`)
  }

  getAllSections(): Observable<Section[]> {
    return this.httpClient.get<Section[]>(`${this.apiUrl}/sections/all`)
  }

  addNewSection(newSection: Section): Observable<Section[]> {
    return this.httpClient.post<Section[]>(`${this.apiUrl}/sections/create`, newSection )
  }

  
  editSection(editSection: Section){
    let id = editSection.id;
    return this.httpClient.put(`${this.apiUrl}/sections/update/${id}`, editSection)
  }

  deleteSection(id: number){
    return this.httpClient.delete(`${this.apiUrl}/sections/delete/${id}`)
  }

}
