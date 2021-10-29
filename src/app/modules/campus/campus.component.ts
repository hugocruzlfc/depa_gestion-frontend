import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms'; 

import { CampusService } from "./services/campus.service";
import { Faculty } from "../shared/interfaces/facultys.interface";
import { Section } from "../shared/interfaces/sections.interface";
import { NotificationService } from '../notification/services/notification.service';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.scss']
})
export class CampusComponent implements OnInit {
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };
  facultysForm: FormGroup;
  sectionsForm: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  facultys$: any;
  sections$: any;
  modalTitle: string = '';
  modalButtom: string = '';
  actionMode: number = 1;
  currentItem: any;
  currentOption: number = 0;

  constructor(private _location: Location, private campusService: CampusService, private fb: FormBuilder,
    private notificationService: NotificationService) {
      this.facultysForm = this.fb.group({
        name: ['', [Validators.required]],
        campus: [''],
      });
      this.sectionsForm = this.fb.group({
        name: ['', [Validators.required]]
      });
     }

  ngOnInit(): void {
  //   this.dtOptions = {
  //     processing: true,
  //     info: true,
  //     retrieve: true,
  //     destroy: true,
  //     responsive: true,
  //     stateSave: true,
  //     columnDefs: [
  //       {
  //         targets:[0],
  //         orderData: [0,1]
  //       },
  //     ],
  //     language: {
  //       emptyTable:	"No hay datos disponibles.",
  //       zeroRecords:	"No se han encontrado coincidencias.",
  //       loadingRecords:	"Cargando...",
  //       processing:	"Procesando...",
  //       search: 'Buscar:',
  //       searchPlaceholder:	"Dato para buscar",
  //       aria: {
	// 				sortAscending:	"Ordenación ascendente",
	// 				sortDescending:	"Ordenación descendente"
	// 			}
  //  }
  // }
  this.facultys$ = this.campusService.facultys;
  this.sections$ = this.campusService.sections;
  }

  backClicked() {
    this._location.back();
  }


  workFaculty(option: number, item?: any){
    switch(option){
      case 1:{
        if(this.facultysForm.invalid){
          return;
        }
        let newFaculty: Faculty;
        newFaculty = this.facultysForm.value;
        this.campusService.addNewFaculty(newFaculty).subscribe(data =>{
          this.facultys$ = this.campusService.getAllFacultys();
         // this.dtTrigger.next();
          this.notificationService.success('Facultad añadida correctamente',this.options);
        });
       
       break;
      }
       case 2:{
        if(this.facultysForm.invalid){
          return;
        }
        let editFaculty: Faculty = this.facultysForm.value;
        editFaculty.id = this.currentItem.id;
        this.campusService.editFaculty(editFaculty).subscribe(data =>{
          this.facultys$ = this.campusService.getAllFacultys();
          this.notificationService.success('Facultad editada correctamente',this.options);
        });
       break;
      }
      case 3:{
        let facultyId = item?.id;
        this.campusService.deleteFaculty(facultyId!).subscribe(data =>{
          this.facultys$ = this.campusService.getAllFacultys();
          this.notificationService.warn('Facultad eliminada correctamente',this.options);
        });
        break;
      }
    }
    
  }
  
  workSection(option: number, item?: Section){
    switch(option){
      case 1:{
        if(this.sectionsForm.invalid){
          return;
        }
        let newSection: Section;
        newSection = this.sectionsForm.value;
        this.campusService.addNewSection(newSection).subscribe(data =>{
          this.sections$ = this.campusService.getAllSections();
          this.notificationService.success('Depatamento añadido correctamente',this.options);
        });
       
       break;
      }
       case 2:{
        if(this.sectionsForm.invalid){
          return;
        }
        let editSection: Section = this.sectionsForm.value;
        editSection.id = this.currentItem.id;
        this.campusService.editSection(editSection).subscribe(data =>{
          this.sections$ = this.campusService.getAllSections();
          this.notificationService.success('Departamento editado correctamente',this.options);
        });
       break;
      }
      case 3:{
        let sectionId = item?.id;
        this.campusService.deleteSection(sectionId!).subscribe(data =>{
          this.sections$ = this.campusService.getAllSections();
          this.notificationService.warn('Departamento eliminado correctamente',this.options);
        });
        break;
      }
    }
    
  }


  modalMode(option: number,mode: number, item?: any){
    
    if (option ==1) {
      this.currentOption = 1;
      this.facultysForm.reset();
      switch(mode){
        case 1:{
          this.modalTitle = 'Añadir Facultad';
          this.actionMode = 1;
          this.modalButtom = 'Añadir';
         
         break;
        }
         case 2:{
          this.modalTitle = 'Editar Facultad';
          this.actionMode = 2
          this.modalButtom = 'Editar'
          this.currentItem = item;
          this.showItem(this.currentItem, 1)
         break;
        }
      }
      
    } else {
      this.currentOption = 2;
      this.sectionsForm.reset();
      switch(mode){
        case 1:{
          this.modalTitle = 'Añadir Departamento';
          this.actionMode = 1;
          this.modalButtom = 'Añadir';
         
         break;
        }
         case 2:{
          this.modalTitle = 'Editar Departamento';
          this.actionMode = 2
          this.modalButtom = 'Editar'
          this.currentItem = item;
          this.showItem(this.currentItem, 2)
         break;
        }
      }
    }

  }

  showItem(item: any, option: number){
    if (option == 1) {
      this.facultysForm.patchValue({
        'name': item.name,
        'campus': item.campus
        });
    } else {
      this.sectionsForm.patchValue({
        'name': item.name
        });
    }
   
   }

}
