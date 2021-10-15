import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import {Location} from '@angular/common';

// import { IncidentsService } from './services/incidents.service';
// import { ComunicationService } from '../shared/services/comunication.service';

import { InventoryService } from './../inventory/services/inventory.service';
import { Plans } from './../shared/interfaces/plans.interface';
import { PlansService } from './services/plans.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {

  plansForm: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  plans: any[] = [];
  modalTitle: string = '';
  modalButtom: string = '';
  actionMode: number = 1;
  currentPlan: any;
  arrayEquipments = this.inventoryService.equipments;
  attended = false;
  datePlanImpres: any;
  equipmentPlanImpres: string = '';
  sectionPlanImpres: string = '';
  facultyPlanImpres: string = '';
  descriptionPlanImpress: string = '';

  constructor(private plansService: PlansService, private _location: Location,
    private fb: FormBuilder,  private inventoryService: InventoryService) { 
    this.plansForm = this.fb.group({
      faculty: ['', [Validators.required]],
      section: ['', [Validators.required]],
       description: ['', [Validators.required]],
       starDate: ['', [Validators.required]],
      equipmentId: [0, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      info: true,
      retrieve: true,
      destroy: true,
      responsive: true,
      stateSave: true,
      columnDefs: [
        {
          targets:[0],
          orderData: [0,1]
        },
      ],
      language: {
        emptyTable:	"No hay datos disponibles.",
        zeroRecords:	"No se han encontrado coincidencias.",
        lengthMenu: 'Mostrar _MENU_  elementos',
        loadingRecords:	"Cargando...",
        processing:	"Procesando...",
        search: 'Buscar:',
        searchPlaceholder:	"Dato para buscar",
        info: 'De _START_ a _END_ de _TOTAL_ elementos',
        infoEmpty: 'De 0 a 0 de 0 elementos',
        infoFiltered: '(filtrados de _MAX_ elementos totales)',
        paginate: {
          first: 'Prim.',
          last: 'Últ.',
          next: 'Sig.',
          previous: 'Ant.'
        },
        aria: {
					sortAscending:	"Ordenación ascendente",
					sortDescending:	"Ordenación descendente"
				}
   }
  }
  this.getPlans();
  
  }

  getPlans(){
    this.plansService.getAllPlans().subscribe(data => {
      const aux: any = data;
      if (aux) {
        this.plans = aux;
        this.dtTrigger.next();
      }
     });
   }


   modalMode(mode: number, item?: any){
    this.plansForm.reset();
    switch(mode){
      case 1:{
        this.modalTitle = 'Añadir Plan de Mantenimiento';
        this.actionMode = 1;
        this.modalButtom = 'Añadir';
       
       break;
      }
      case 2:{
        this.modalTitle = 'Detalles del Plan de Mantenimiento';
        this.actionMode = 3
        this.currentPlan = item;
        this.showPlan(this.currentPlan);
        this.datePlanImpres = item.starDate;
         this.equipmentPlanImpres = item.equipments.name
        this.sectionPlanImpres = item.section;
        this.facultyPlanImpres = item.faculty;
        this.descriptionPlanImpress = item.description;
       break;
      }
       case 3:{
        this.modalTitle = 'Editar Plan de Mantenimiento';
        this.actionMode = 2
        this.modalButtom = 'Editar'
        this.currentPlan = item;
        this.showPlan(this.currentPlan)
       break;
      }
    }
  }

  showPlan(item: any){
    this.plansForm.patchValue({
      'starDate': item.starDate,
      'equipmentId': item.equipments.name,
      'description': item.description,
      'faculty': item.equipments.faculty,
      'section': item.equipments.section,
      });
      if (item.done == 'Si') {
        this.attended = true
      }else{
        this.attended = false;
      }
   }

   async workInPlans(){
    if (this.actionMode == 1) {
      var newPlan: Plans;
      newPlan = this.plansForm.value;
      console.log(newPlan);
      console.log(this.plansForm.value);

    this.plansService.addNewPlan(newPlan,).subscribe(data=>this.getPlans());
   } else { //editar
    var editPlan: Plans = this.plansForm.value;
    editPlan.id =  this.currentPlan.id;
    editPlan.equipmentId=  this.currentPlan.equipmentId;
    this.plansService.editPlan(editPlan).subscribe(data=>{this.getPlans();});
   }
   this.plansForm.reset();
  }

  toDone(item: Plans){
    this.plansService.toDone(item).subscribe(data=>{this.getPlans();});
  }

  deletePlan(item: any){
    const planId = item.id;
    this.plansService.deletePlan(planId).subscribe(data=>{this.getPlans();});
  }

  backClicked() {
    this._location.back();
  }

}
