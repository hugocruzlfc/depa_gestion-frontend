import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';

import { IncidentsRoutingModule } from './incidents-routing.module';
import { IncidentsComponent } from './incidents.component';



@NgModule({
  declarations: [
    IncidentsComponent
  ],
  imports: [
    CommonModule,
    IncidentsRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    FormsModule
  ]
})
export class IncidentsModule { }
