import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'general-app-services-details',
  templateUrl: './services-details.component.html',
  styleUrls: ['./services-details.component.scss']
})
export class ServicesDetailsComponent implements OnInit {
  @Output() eventEmitterEdit = new EventEmitter();

  constructor() { }

  tableList: any[] = [];
  ngOnInit(): void {
  }

  edit(item: any) {
    this.eventEmitterEdit.emit(item);
  }


}
