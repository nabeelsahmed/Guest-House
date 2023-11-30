import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@NgModule({
  imports: [CommonModule, InputTextModule, PasswordModule],
  exports: [InputTextModule, PasswordModule],
})
export class PrimengModule {}
