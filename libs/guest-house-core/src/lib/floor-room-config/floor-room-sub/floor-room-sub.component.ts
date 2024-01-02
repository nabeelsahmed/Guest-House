import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'general-app-floor-room-sub',
  templateUrl: './floor-room-sub.component.html',
  styleUrls: ['./floor-room-sub.component.scss']
})


export class FloorRoomSubComponent implements OnInit {

  constructor() { }
  roomList: any = []
  roomType: any = [];


  ngOnInit(): void {
  }

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



  validateInput(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.charCode);
    if (!/^\d+$/.test(inputChar) || event.key === 'e') {
      event.preventDefault();
    }
    //prevent minus input
    if (event.key === '-' || event.key === 'Minus') {
      event.preventDefault();
    }
  }

}
