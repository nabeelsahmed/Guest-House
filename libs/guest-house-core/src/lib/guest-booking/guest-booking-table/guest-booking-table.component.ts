import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'general-app-guest-booking-table',
  templateUrl: './guest-booking-table.component.html',
  styleUrls: ['./guest-booking-table.component.scss'],
})
export class GuestBookingTableComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();

  tblSearch: any = '';

  tableData: any = [];

  constructor() {}

  ngOnInit(): void {}

  edit(item: any) {
    this.eventEmitter.emit(item);
  }
}
