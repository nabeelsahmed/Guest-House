import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  imports: [CommonModule, InputTextModule, PasswordModule, RadioButtonModule, DropdownModule],
  exports: [InputTextModule, PasswordModule, RadioButtonModule, DropdownModule],
})
export class PrimengModule {}
