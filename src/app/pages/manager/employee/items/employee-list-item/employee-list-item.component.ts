import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { EmployeeItem } from './../employee.item';


@Component({
 selector: '[app-employee-list-item]',
  imports: [DatePipe, MaterialModule],
  templateUrl: './employee-list-item.component.html',
})
export class EmployeeListItemComponent {
  @Input() employee!: EmployeeItem;
  @Input() my_id: String;


  @ViewChild('details_modal') details_modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('fire_modal') fire_modal!: ElementRef<HTMLDialogElement>;
  // Open a modal
  openModal(modal: HTMLDialogElement) {
    modal.showModal();
  }

  // Close a modal
  closeModal(modal: HTMLDialogElement) {
    modal.close();
  }

  fireEmployee(){

  }
}
