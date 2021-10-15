import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Observable } from 'rxjs';
import {Location} from '@angular/common';

import { ReportsService } from './services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  incidents$ = this.reportService.incidents;
  equipments$ = this.reportService.equipments
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabelsMonts: Label[] = ['Enero', 'Febrero','Marzo', 'Abril', 'Mayo', 
  'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  public barChartLabelsSections: Label[] = [];
  public barChartLabelsYears: Label[] = [];
  // public barChartLabelsSections: Label[] = ['Informática', 'Matemática','Industrial', 'Economía', 'Turismo', 
  // 'RRHH', 'Jul', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartDataMonts: ChartDataSets[] = [
    { data:[], label: 'Roturas' },
    //{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];
  public barChartDataSections: ChartDataSets[] = [
    { data:[], label: 'Equipos' },
    //{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];
  public barChartDataYears: ChartDataSets[] = [
    { data:[], label: 'Roturas' },
    //{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];
  ruta: string = 'roturas';

  constructor(private reportService: ReportsService, private _location: Location) { }

  ngOnInit(): void {
    this.getBreaks();
    this.getEquipmentsByDepa();
    this.getBreaksForYears();
  }

  changeMenu(options: number){
    switch(options){
      case 1:{
        
          this.ruta = 'roturas';
          break;
      }
      case 2:{
          this.ruta = 'equipos';
          break;
      }
      case 3:{
          this.ruta = 'comportamiento';
          break;
      }
   }
  }

  getBreaks(){
    this.incidents$.subscribe(data =>{
      let incidentByMont = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      for (let index = 0; index < data.length; index++) {
        let actualIncident: any = data[index];
        let mont =  new Date(actualIncident.createdAt).getMonth();
        incidentByMont[mont]++
        this.barChartDataMonts[0].data = incidentByMont;
      }
    })
  }

  getBreaksForYears(){
    this.incidents$.subscribe(data =>{
      let years: any[] = []
      for (let index = 0; index < data.length; index++) {
        let actualIncident: any = data[index];
        let currentYear =  new Date(actualIncident.createdAt).getFullYear();
        let newYear={
          year: currentYear,
          count: 1
    };
    let existYear = false;
    for (let index1 = 0; index1 < years.length; index1++) {
        if(years[index1].year == newYear.year){
          existYear = true;
          years[index1].count ++;
          break;
        }
      }
      if (!existYear) {
        years.push(newYear);
      }
      }
      for (let index = 0; index < years.length; index++) {
        this.barChartLabelsYears.push(years[index].year);
        this.barChartDataYears[0].data?.push(years[index].count);
      }
    })
  }

  getEquipmentsByDepa(){
    this.equipments$.subscribe(data =>{
      let sections: any[] = []
      //let incidentByMont = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      for (let index = 0; index < data.length; index++) {
        const currentSection = data[index].section;
        let newSection={
              name: currentSection,
              count: 1
        };
        let existSection = false;
        for (let index1 = 0; index1 < sections.length; index1++) {
            if(sections[index1].name == newSection.name){
              existSection = true;
              sections[index1].count ++;
              break;
            }
          }
          if (!existSection) {
            sections.push(newSection);
          }
      }
      for (let index = 0; index < sections.length; index++) {
        this.barChartLabelsSections.push(sections[index].name);
        this.barChartDataSections[0].data?.push(sections[index].count);
      }
    })
  }

  backClicked() {
    this._location.back();
  }

}
