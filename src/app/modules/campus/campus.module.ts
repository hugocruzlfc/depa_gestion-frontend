import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';

import { CampusRoutingModule } from './campus-routing.module';
import { CampusComponent } from './campus.component';


@NgModule({
  declarations: [
    CampusComponent
  ],
  imports: [
    CommonModule,
    CampusRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    FormsModule
  ]
})
export class CampusModule { }
