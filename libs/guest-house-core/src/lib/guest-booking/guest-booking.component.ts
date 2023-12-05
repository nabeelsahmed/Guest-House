import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'general-app-guest-booking',
  templateUrl: './guest-booking.component.html',
  styleUrls: ['./guest-booking.component.scss']
})
export class GuestBookingComponent implements OnInit {

  constructor() { }
  value: string | undefined; 
  ingredient!: string;
  selectedCity!: string;
  cities!: string[];
  
  ngOnInit(): void {
  }

}
