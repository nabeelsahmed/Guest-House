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

  @Input() roomList: any = []





  detailsRow: any[] = [1, 2, 3, 4]


  deleteItem(item: number): void {
    if (this.roomList != null || []) {
      this.roomList.splice(item, 1);
    }
  }

  addItem(item: number): void {
    this.roomList.push(item + 1);
  }


  ngOnInit(): void {
  }


}
