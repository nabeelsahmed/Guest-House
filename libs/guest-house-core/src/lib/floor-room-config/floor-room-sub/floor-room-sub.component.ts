import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'general-app-floor-room-sub',
  templateUrl: './floor-room-sub.component.html',
  styleUrls: ['./floor-room-sub.component.scss']
})
export class FloorRoomSubComponent implements OnInit {





  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
  ];

  selectedCity = 'Islamabad';

  constructor() { }


  @Input() totalRows = [1, 2];


  detailsRow: any[] = [1, 2, 3, 4]


  deleteItem(item: number): void {
    this.detailsRow.splice(item, 1);
  }

  addItem(item: number): void {
    this.detailsRow.push(item + 1);
  }


  ngOnInit(): void {
  }

}
