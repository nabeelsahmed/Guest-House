import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputMaskModule } from 'primeng/inputmask';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  imports: [CommonModule, TableModule, TabViewModule, InputTextareaModule, InputMaskModule, CalendarModule, InputTextModule, PasswordModule, RadioButtonModule, DropdownModule],
  exports: [InputTextModule, TableModule, TabViewModule, InputTextareaModule, InputMaskModule, CalendarModule, PasswordModule, RadioButtonModule, DropdownModule],
})
export class PrimengModule { }
