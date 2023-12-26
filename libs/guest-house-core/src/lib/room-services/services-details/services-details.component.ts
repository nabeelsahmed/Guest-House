import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'general-app-services-details',
  templateUrl: './services-details.component.html',
  styleUrls: ['./services-details.component.scss']
})
export class ServicesDetailsComponent implements OnInit {

  constructor() { }

  tableList: any[] = [];
  ngOnInit(): void {
  }

}
