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
  facultys$ = this.campusService.facultys;
  sections$ = this.campusService.sections;

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
  }

  backClicked() {
    this._location.back();
  }


}
