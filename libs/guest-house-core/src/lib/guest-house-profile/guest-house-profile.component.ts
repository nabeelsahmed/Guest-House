import { Component, OnInit } from '@angular/core';

import { SharedHelpersFieldValidationsModule } from '@general-app/shared/helpers/field-validations';
import { MyFormField, AddServicesInterface } from '@general-app/shared/interface';
import { SharedServicesDataModule } from '@general-app/shared/services/data';
import { SharedServicesGlobalDataModule } from '@general-app/shared/services/global-data';


@Component({
  selector: 'general-app-guest-house-profile',
  templateUrl: './guest-house-profile.component.html',
  styleUrls: ['./guest-house-profile.component.scss']
})
export class GuestHouseProfileComponent implements OnInit {



  products = [
    {
      id: '1000',
      code: 'f230fh0g3',
      name: 'Bamboo Watch',
      description: 'Product Description',
      image: 'bamboo-watch.jpg',
      price: 65,
      category: 'Accessories',
      quantity: 24,
      inventoryStatus: 'INSTOCK',
      rating: 5
    },
  ]
  constructor() { }

  isVisible: boolean = false;

  visibilityFunction() {
    this.isVisible = !this.isVisible
  }



  value: string | undefined
  ngOnInit(): void {
  }


}
