import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'general-app-room-features',
  templateUrl: './room-features.component.html',
  styleUrls: ['./room-features.component.scss']
})
export class RoomFeaturesComponent implements OnInit {

  constructor() { }


  roomFeatures = [
    {
      label: "Air Condition",
      name: "airCondition",
      options: [
        { label: "Yes", value: "Yes", id: "airConditionYes" },
        { label: "No", value: "No", id: "airConditionNo" }
      ]
    },
    {
      label: "Window",
      name: "window",
      options: [
        { label: "Yes", value: "Yes", id: "windowYes" },
        { label: "No", value: "No", id: "windowNo" }
      ]
    },
    {
      label: "Sun Face",
      name: "sunFace",
      options: [
        { label: "Yes", value: "Yes", id: "sunFaceYes" },
        { label: "No", value: "No", id: "sunFaceNo" }
      ]
    },
    {
      label: "Sun Face",
      name: "sunFace",
      options: [
        { label: "Yes", value: "Yes", id: "sunFaceYes" },
        { label: "No", value: "No", id: "sunFaceNo" }
      ]
    },
    {
      label: "Sun Face",
      name: "sunFace",
      options: [
        { label: "Yes", value: "Yes", id: "sunFaceYes" },
        { label: "No", value: "No", id: "sunFaceNo" }
      ]
    },
    {
      label: "Sun Face",
      name: "sunFace",
      options: [
        { label: "Yes", value: "Yes", id: "sunFaceYes" },
        { label: "No", value: "No", id: "sunFaceNo" }
      ]
    }
  ]


  ngOnInit(): void {
  }

}
