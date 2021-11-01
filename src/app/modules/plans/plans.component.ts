import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import {Location} from '@angular/common';

// import { IncidentsService } from './services/incidents.service';
// import { ComunicationService } from '../shared/services/comunication.service';

import { InventoryService } from './../inventory/services/inventory.service';
import { Plans } from './../shared/interfaces/plans.interface';
import { PlansService } from './services/plans.service';
import { NotificationService } from '../notification/services/notification.service';
import { CampusService } from "../campus/services/campus.service";

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
  sectionPlanImpres: string = '';
  facultyPlanImpres: string = '';
  descriptionPlanImpress: string = '';
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  sections$ = this.campusService.sections;
  facultys$ = this.campusService.facultys;
  sectionSelect: any;
  facultySelect: any

  constructor(private plansService: PlansService, private _location: Location,private campusService: CampusService,
    private notificationService: NotificationService,
    private fb: FormBuilder,  private inventoryService: InventoryService) { 
    this.plansForm = this.fb.group({
      facultyId: [null, [Validators.required]],
      sectionId: [null, [Validators.required]],
       description: ['', [Validators.required]],
       starDate: ['', [Validators.required]]
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
        this.sectionPlanImpres = item.sections.name;
        this.facultyPlanImpres = item.facultys.name;
        this.descriptionPlanImpress = item.description;
       break;
      }
       case 3:{
        this.modalTitle = 'Editar Plan de Mantenimiento';
        this.actionMode = 2
        this.modalButtom = 'Editar'
        this.currentPlan = item;
        this.facultySelect = this.currentPlan.facultys ? this.currentPlan.facultys.id : "";
        this.sectionSelect = this.currentPlan.sections ? this.currentPlan.sections.id : "";
        this.showPlan(this.currentPlan)
       break;
      }
    }
  }

  showPlan(item: any){
    this.plansForm.patchValue({
      'starDate': item.starDate,
      'description': item.description,
      'facultyId': item.facultys?.name,
       'sectionId': item.sections?.name,
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
      newPlan.facultyId = +this.plansForm.value.facultyId;
      newPlan.sectionId = +this.plansForm.value.sectionId;
    this.plansService.addNewPlan(newPlan,).subscribe(data=>{
      this.getPlans();
      this.notificationService.success('Plan creado correctamente',this.options);
    });
   } else { //editar
    var editPlan: Plans = this.plansForm.value;
    editPlan.id =  this.currentPlan.id;
    editPlan.facultyId = +this.plansForm.value.facultyId;
    editPlan.sectionId = +this.plansForm.value.sectionId;
    this.plansService.editPlan(editPlan).subscribe(data=>{
      this.getPlans();
      this.notificationService.success('Plan actualizado correctamente',this.options);
    });
   }
   this.plansForm.reset();
  }

  toDone(item: Plans){
    this.plansService.toDone(item).subscribe(data=>{
      this.getPlans();
      this.notificationService.success('Plan atendido correctamente',this.options);
    });
  }

  deletePlan(item: any){
    const planId = item.id;
    this.plansService.deletePlan(planId).subscribe(data=>{
      this.getPlans();
      this.notificationService.warn('Plan eliminado correctamente',this.options);
    });
  }

  backClicked() {
    this._location.back();
  }

}
