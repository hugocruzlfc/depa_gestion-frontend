
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import {Location} from '@angular/common';

import { User } from './../shared/interfaces/users.interface';
import { Faculty } from './../shared/interfaces/facultys.interface';
import { Section } from './../shared/interfaces/sections.interface';
import { UsersService } from './services/users.service';
import { NotificationService } from '../notification/services/notification.service';
import { CampusService } from "../campus/services/campus.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  //users$ = this.userService.users;
  users = Array<User>();
  modalTitle: string = '';
  modalButtom: string = '';
  intervalVariable : any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  userForm: FormGroup;
  private isEmail = /\S+@\S+\.\S+/;
  private passwordSize = /[a-zA-z0-9]{6,16}/i;
  actionMode: number = 1;
  currenUser: any;
  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }
  // sections = Array<Section>();
  // facultys= Array<Faculty>();
  sections$ = this.campusService.sections;
  facultys$ = this.campusService.facultys;
  sectionSelect: any;
  facultySelect: any;

  constructor(private userService: UsersService,private campusService: CampusService,
    private notificationService: NotificationService,
    private fb: FormBuilder,private _location: Location) { 
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      dni: [null, [Validators.required]],
      celular: [null, [Validators.required]],
      role: ['', [Validators.required]],
      faculty: ['', [Validators.required]],
      section: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.isEmail)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordSize)]],
    });
  }

  ngOnInit() {
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
  this.getUsers();
  }

  getUsers(){
    this.userService.getAllUser().subscribe(data => {
      const aux: any = data;
      if (aux) {
        this.users = aux;
        this.dtTrigger.next();
      }
     });
   }
 
  async workerUser(){
     if (this.actionMode == 1) {
        var newUser: User;
        newUser = this.userForm.value;
        this.userService.addNewUser(newUser).subscribe(data=>{
          this.getUsers();
          this.notificationService.success('Usuario creado correctamente',this.options);
        });
     } else { //editar
      var editUser: User = this.userForm.value;
      editUser.id =  this.currenUser.id;
      this.userService.editUser(editUser).subscribe(data=>{
        this.getUsers();
        this.notificationService.success('Usuario actualizado correctamente',this.options);
      });
     }
     this.userForm.reset();
     
  }
  
 showUser(item: User){
  this.userForm.patchValue({
    'name': item.name,
    'address':  item.address,
    'dni':  item.dni,
    'celular':  item.celular,
    'role': item.role,
    'faculty': item.facultys?.name,
    'section': item.sections?.name,
    'email': item.email,
    'password': item.password
    })
 }

  modalMode(mode: number, item?: User){
    this.userForm.reset();
    switch(mode){
      case 1:{
        this.modalTitle = 'Añadir Usuario';
        this.actionMode = 1;
        this.modalButtom = 'Añadir';
       
       break;
      }
      case 2:{
        this.modalTitle = 'Detalles del Usuario';
        this.actionMode = 3
        this.currenUser = item;
        this.showUser(this.currenUser)
       break;
      }
       case 3:{
        this.modalTitle = 'Editar Usuario';
        this.actionMode = 2
        this.modalButtom = 'Editar'
        this.currenUser = item;
        this.facultySelect = this.currenUser.facultys.id;
        this.sectionSelect = this.currenUser.sections.id;
        this.showUser(this.currenUser)
       break;
      }
    }

  }

  backClicked() {
    this._location.back();
  }

  // getCampus(){
  //     let sections$ = this.campusService.sections;
  //     let facultys$ = this.campusService.facultys;
  //     sections$.subscribe(element => {
  //     this.sections = element
  //   });
  // }


}
