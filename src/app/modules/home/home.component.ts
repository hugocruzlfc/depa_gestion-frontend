import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {  Subscription } from 'rxjs';

import { ComunicationService } from '../shared/services/comunication.service';
import { BackNotificationsService } from '../shared/services/back-notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  userName = '';
  admin: boolean = false;
  allNotifications$ = this.backNotificationsService.backNotifications;
  totalNotifications: number | undefined;
  currentUser = '';
  private subscription: Subscription | undefined;

  constructor(private router: Router, private route: ActivatedRoute, 
    private backNotificationsService: BackNotificationsService,
    private comunicationService: ComunicationService) {
    const navigation = this.router.getCurrentNavigation();
    let user = navigation?.extras?.state;
    this.userName = user?.name;
    this.comunicationService.changeRole(user?.role);
    this.comunicationService.changeUserId(user?.id);
    this.subscription = this.allNotifications$.subscribe(element => {
          this.totalNotifications = element.length;
        });

    switch(user?.role){
      case 'Administrador':{
        this.router.navigate(['admin'], {relativeTo: this.route});
        this.admin = true;
        this.currentUser = 'Administrador';
       break;
      }  
      case 'Técnico':{
        this.router.navigate(['admin'], {relativeTo: this.route});
        this.admin = true;
        this.currentUser = 'Técnico';
       break;
      }
      case 'Usuario':{
        this.router.navigate(['welcome'], {relativeTo: this.route});
        this.currentUser = 'Usuario';
       break;
      }
    }
   }

  ngOnInit(): void {
  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  logout(){
    this.router.navigate(['login']);
  }

}
