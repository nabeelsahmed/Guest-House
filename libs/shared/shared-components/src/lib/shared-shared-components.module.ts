import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';

import { TextMaskModule } from 'angular2-text-mask';
import { MaterialModule } from '@general-app/material';
import { FormsModule } from '@angular/forms';

import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PincodeComponent } from './pincode/pincode.component';
import { PdfUploadComponent } from './pdf-upload/pdf-upload.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    PerfectScrollbarModule,
    TextMaskModule,
  ],
  declarations: [
    ContactInfoComponent,
    ImageUploadComponent,
    PincodeComponent,
    PdfUploadComponent,
  ],
  exports: [
    ContactInfoComponent,
    ImageUploadComponent,
    PincodeComponent,
    PdfUploadComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
})
export class SharedSharedComponentsModule {}
