import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import {Location} from '@angular/common';

import { IncidentsService } from './services/incidents.service';
import { InventoryService } from './../inventory/services/inventory.service';
import { Incidents } from './../shared/interfaces/incidents.interface';
import { ComunicationService } from '../shared/services/comunication.service';
import { BackNotificationsService } from '../shared/services/back-notifications.service';
import { BackNotification } from '../shared/interfaces/backNotifications.interface';

@Component({
  selector: 'app-incidents',
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.scss']
})
export class IncidentsComponent implements OnInit {

  incidentsForm: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  incidents: any[] = [];
  modalTitle: string = '';
  modalButtom: string = '';
  actionMode: number = 1;
  currentIncident: any;
  arrayEquipments = this.inventoryService.equipments;
  userId = 0;
  attended = false;
  private subscription: Subscription | undefined;
  private subscriptionUser: Subscription | undefined;
  currentRole = '';

  constructor(private incidentService: IncidentsService, 
    private _location: Location, private backNotificationsService: BackNotificationsService,
    private fb: FormBuilder, private inventoryService: InventoryService,
    private comunicationService: ComunicationService) { 
    this.incidentsForm = this.fb.group({
      issue: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['', [Validators.required]],
      equipmentId: [0, [Validators.required]]
    });
    this.subscriptionUser = this.comunicationService.customUserId.subscribe(userId => this.userId = userId);
    this.subscriptionUser = this.comunicationService.customRole.subscribe(role => this.currentRole = role).add();
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
  this.getIncidents();
  
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscriptionUser?.unsubscribe();
  }

  getIncidents(){
    if (this.currentRole === 'Usuario') {
      this.subscription = this.incidentService.getAllIncidentsByUser(this.userId).subscribe(data => {
        const aux: any = data;
        if (aux) {
          this.incidents = aux;
          this.dtTrigger.next();
        }
       }).add();
      
    } else {
      this.subscription = this.incidentService.getAllIncidents().subscribe(data => {
        const aux: any = data;
        if (aux) {
          this.incidents = aux;
          this.dtTrigger.next();
        }
       }).add();
    }
    
   }


   modalMode(mode: number, item?: Incidents){
    this.incidentsForm.reset();
    switch(mode){
      case 1:{
        this.modalTitle = 'Añadir Incidencia';
        this.actionMode = 1;
        this.modalButtom = 'Añadir';
       
       break;
      }
      case 2:{
        this.modalTitle = 'Detalles del Incidencia';
        this.actionMode = 3
        this.currentIncident = item;
        this.showIncident(this.currentIncident)
       break;
      }
       case 3:{
        this.modalTitle = 'Editar Incidencia';
        this.actionMode = 2
        this.modalButtom = 'Editar'
        this.currentIncident = item;
        this.showIncident(this.currentIncident)
       break;
      }
    }
  }

  showIncident(item: any){
    this.incidentsForm.patchValue({
      'issue': item.issue,
      'description': item.description,
      'equipmentId': item.equipments.name,
      'type': item.type
      });
      if (item.attended == 'Si') {
        this.attended = true
      }else{
        this.attended = false;
      }
      
   }

   async workInIncidents(){
    if (this.actionMode == 1) {
      var newIncidents: Incidents;
      newIncidents = this.incidentsForm.value;
      newIncidents.userId = this.userId;
      this.subscription = this.incidentService.addNewIncident(newIncidents,).subscribe(data=>{
        this.getIncidents();
        const aux: any = data;
        let newBackNotification: BackNotification  ={
          incidentId: aux.id
        }
        this.backNotificationsService.createBackNotifications(newBackNotification).subscribe();
      }).add();
     
   } else { //editar
    var editIncident: Incidents = this.incidentsForm.value;
    editIncident.id =  this.currentIncident.id;
    editIncident.equipmentId=  this.currentIncident.equipmentId;
    this.incidentService.editIncident(editIncident).subscribe(data=>{this.getIncidents();});
   }
   this.incidentsForm.reset();
  }

  toAtention(item: any){
    const incidentId = item.id;
    this.incidentService.toAtention(item).subscribe(data=>{
      this.getIncidents();
      this.backNotificationsService.deleteBackNotifications(incidentId).subscribe();
    });
  }
  

  deleteIncident(item: any){
    const incidentId = item.id;
    this.incidentService.deleteIncident(incidentId).subscribe(data=>{
      this.getIncidents();
      this.backNotificationsService.deleteBackNotifications(incidentId).subscribe();
    });
  }

  backClicked() {
    this._location.back();
  }

}
