import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import  { NgxPrintModule }  from  'ngx-print' ;

import { PlansRoutingModule } from './plans-routing.module';
import { PlansComponent } from './plans.component';


@NgModule({
  declarations: [
    PlansComponent
  ],
  imports: [
    CommonModule,
    PlansRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    FormsModule,
    NgxPrintModule 
  ]
})
export class PlansModule { }
