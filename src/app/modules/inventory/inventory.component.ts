
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import {Location} from '@angular/common';

import { Equipment } from '../shared/interfaces/equipment.interface';
import { Hardware } from './../shared/interfaces/hardware.interface';
import { InventoryService } from './services/inventory.service';
import { ComunicationService } from '../shared/services/comunication.service';
import { NotificationService } from '../notification/services/notification.service';
import { CampusService } from "../campus/services/campus.service";
declare var $: any;

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  equipmentForm: FormGroup;
  hardwareForm: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  modalTitle: string = '';
  modalButtom: string = '';
  actionMode: number = 1;
  equipments = Array<Equipment>();
  currentEquipment: any;
  currentHardware: any;
  currentRole:string = '';
 arrayHardwares: Hardware[] = [];
 arrayHardwaresEdit: Hardware[] = [];
 noSerie:string = '';
 label:string = '';
 name:string = '';
 options = {
  autoClose: true,
  keepAfterRouteChange: false
};
sections$ = this.campusService.sections;
  facultys$ = this.campusService.facultys;
  sectionSelect: any;
  facultySelect: any;
  fieldHardwaresValidators: any;

  constructor(private inventoryService: InventoryService,private campusService: CampusService,
     private notificationService: NotificationService,
    private fb: FormBuilder,private _location: Location,
    private comunicationService: ComunicationService) {
    this.equipmentForm = this.fb.group({
      name: ['', [Validators.required]],
      facultyId: [null, [Validators.required]],
      sectionId: [null, [Validators.required]],
    });
    this.hardwareForm = this.fb.group({
      name: ['', [Validators.required]],
      noSerie: ['', [Validators.required]],
      label: ['', [Validators.required]]
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
  this.getEquipments();
  this.comunicationService.customRole.subscribe(role => this.currentRole = role);
 
  }

  getEquipments(){
    this.inventoryService.getAllEquipments().subscribe(data => {
      const aux: any = data;
      if (aux) {
        this.equipments = aux;
        this.dtTrigger.next();
      }
     });
   }

   showEquipment(item: any){
    this.arrayHardwares= [];
    this.arrayHardwaresEdit = [];
    this.equipmentForm.patchValue({
      'name': item.name,
      'faculty': item.faculty,
      'section': item.section
      });
      this.arrayHardwares = item.hardwares;
   }
 
  modalMode(mode: number, item?: any){
    this.equipmentForm.reset();
    this.arrayHardwares = [];
    this.arrayHardwaresEdit = [];
    this.fieldHardwaresValidators = 0;
    switch(mode){
      case 1:{
        this.modalTitle = 'Añadir Equipo';
        this.actionMode = 1;
        this.modalButtom = 'Añadir';
        this.facultySelect = "";
        this.sectionSelect = "";
        this.noSerie = '';
        this.label = '';
        this.name = '';
       break;
      }
      case 2:{
        this.modalTitle = 'Detalles del Equipo';
        this.actionMode = 3
        this.currentEquipment = item;
        this.showEquipment(this.currentEquipment)
       break;
      }
       case 3:{
        this.modalTitle = 'Editar Equipo';
        this.actionMode = 2
        this.modalButtom = 'Editar'
        this.currentEquipment = item;
        this.facultySelect = this.currentEquipment.facultys ? this.currentEquipment.facultys.id : "";
        this.sectionSelect = this.currentEquipment.sections ? this.currentEquipment.sections.id : "";
        this.showEquipment(this.currentEquipment)
       break;
      }
    }
  }
   async workerEquipment(){
    if (this.actionMode == 1) {
      var newEquipment: Equipment;
      newEquipment = this.equipmentForm.value;
      newEquipment.facultyId = +this.equipmentForm.value.facultyId;
      newEquipment.sectionId = +this.equipmentForm.value.sectionId;
      this.inventoryService.addNewEquipment(newEquipment,this.arrayHardwares).subscribe(data=>{
        this.getEquipments();
        this.notificationService.success('Equipo registrado correctamente',this.options);
      });
   } else { //editar
    var editEquipment: Equipment = this.equipmentForm.value;
    editEquipment.id =  this.currentEquipment.id;
    editEquipment.facultyId = +this.equipmentForm.value.facultyId;
    editEquipment.sectionId = +this.equipmentForm.value.sectionId;
    this.inventoryService.editEquipment(editEquipment,this.arrayHardwaresEdit ).subscribe(data=>{
      this.getEquipments();
      this.notificationService.success('Equipo actualizado correctamente',this.options);
    });
   }
   this.equipmentForm.reset();
   this.noSerie = '';
     this.label = '';
     this.name = '';
     this.arrayHardwares = [];
     this.arrayHardwaresEdit = [];
  }

  addHardwares(){
    if (this.noSerie !='' && this.label != '' && this.name != '') {
      this.fieldHardwaresValidators = 1; 
      let newHardware: Hardware ={
        noSerie: this.noSerie,
        label: this.label,
        name: this.name
      };
      this.arrayHardwares.push(newHardware);
      if (this.actionMode == 2) {
        this.arrayHardwaresEdit.push(newHardware)
      }
       this.noSerie = '';
       this.label = '';
       this.name = '';
    }else{
     this.fieldHardwaresValidators = 2; 
     console.log(this.fieldHardwaresValidators);
    }
   
  }


  closeModalComponent(){
    $("#modalComponent").modal("hide");
  }

  getHardware(item:Hardware){
    this.hardwareForm.patchValue({
      'name': item.name,
      'label': item.label,
      'noSerie': item.noSerie
      });
      this.currentHardware = item;
  }

  editHardwares(){
    var editHardware: Hardware = this.hardwareForm.value;
    editHardware.id = this.currentHardware.id;
    editHardware.equipmentId = this.currentHardware.equipmentId;
    this.inventoryService.editHardware(editHardware).subscribe(data=>{
      this.getEquipments();
      this.inventoryService.getEquipmentById(this.currentEquipment.id).subscribe(
        data=>{
          let aux: any = data;
          this.arrayHardwares = [];
          this.arrayHardwares = aux.hardwares;
        });
    });
   
    $("#modalComponent").modal("hide");
  }

  backClicked() {
    this._location.back();
  }

}


