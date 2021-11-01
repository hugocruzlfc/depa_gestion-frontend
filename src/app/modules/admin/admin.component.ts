import { Component, OnInit } from '@angular/core';

import { AdminService } from './services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  allUsers$ = this.adminService.users;
  allEquipments$ = this.adminService.equipments;
  cantUser = 0;
  cantEquipments = 0;
  allIncidents$ = this.adminService.incidents;
  cantIncidents = 0;
  allPlans$ = this.adminService.plans;
  cantPlans = 0;

  constructor(private adminService: AdminService) { 
    this.allUsers$.subscribe(element => this.cantUser = element.length);
    this.allEquipments$.subscribe(element => this.cantEquipments = element.length);
    this.allIncidents$.subscribe(element =>{
      for( let incendet of element){
         if (incendet.attended ==='No') {
          this.cantIncidents ++;
         }
      }
    });
    this.allPlans$.subscribe( element =>{
      for( let plan of element){
        if (plan.done ==='No') {
         this.cantPlans ++;
        }
     }
    });
  }

  ngOnInit(): void {
   
  }

}
