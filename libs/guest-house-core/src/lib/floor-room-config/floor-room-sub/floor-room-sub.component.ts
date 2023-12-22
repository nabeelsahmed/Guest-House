import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'general-app-floor-room-sub',
  templateUrl: './floor-room-sub.component.html',
  styleUrls: ['./floor-room-sub.component.scss']
})


export class FloorRoomSubComponent implements OnInit {







  // selectedCity = 'Islamabad';

  constructor() { }

  roomList: any = []
  roomType: any = [];




  deleteItem(item: number): void {
    const index = this.roomList.indexOf(item);
    if (index !== -1) {
      this.roomList.splice(index, 1);
    }
  }

  addItem(item: number): void {
    this.roomList.push({
      'Room Name': '',
      'Room Type': null
    });
  }
  ngOnInit(): void {

  }




}
