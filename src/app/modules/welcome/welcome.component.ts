import { Component, OnInit } from '@angular/core';

import { WelcomeService } from './services/welcome.service';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

 
  allIncidents$ = this.welcomeService.incidents;
  cantIncidents = 0;
  

  constructor(private welcomeService: WelcomeService) { 
    this.allIncidents$.subscribe(element => {
      for (let index = 0; index < element.length; index++) {
        if (element[index].attended ==='No') {
          this.cantIncidents ++;
        }
      }
    });
  }

  ngOnInit(): void {
    
  }

}
