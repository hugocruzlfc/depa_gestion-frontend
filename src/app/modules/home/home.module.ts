import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NotificationModule } from '../notification/notification.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatBadgeModule,
    NotificationModule
  ]
})
export class HomeModule { }
