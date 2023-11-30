import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'general-app-branch-steup-table',
  templateUrl: './branch-steup-table.component.html',
  styleUrls: ['./branch-steup-table.component.scss']
})
export class BranchSteupTableComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter();
  @Output() eventEmitterEdit = new EventEmitter();
  
  tableData: any = [];
  constructor() { }

  ngOnInit(): void {
  }

  addDepartment(item: any, status: any){
    this.eventEmitter.emit({item, status});
  }

  edit(item: any){
    this.eventEmitterEdit.emit(item);
  }
}
