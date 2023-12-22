import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'general-app-room-features',
  templateUrl: './room-features.component.html',
  styleUrls: ['./room-features.component.scss']
})
export class RoomFeaturesComponent implements OnInit {

  constructor() { }

  roomFeaturesList: any[] = []

  jsonRoomFeatures: any[] = []






  ngOnInit(): void {
  }

}
