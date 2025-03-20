import {
  Component, Input,
  ElementRef, ViewChild , inject }                  from '@angular/core';
import { DatePipe }                                 from '@angular/common';
import { FormsModule, NgModel }                     from '@angular/forms';
import { MaterialModule }                           from 'src/app/material.module';
import { EmployeeItem }                             from './../employee.item';
import { UserService }                              from 'src/app/services/user.service'

@Component({
 selector: '[app-employee-list-item]',
  imports: [DatePipe, MaterialModule , FormsModule],
  templateUrl: './employee-list-item.component.html',
})
export class EmployeeListItemComponent {
  @Input() employee!: EmployeeItem;
  @Input() my_id: String;

  password:String;

  private user_service = inject(UserService);
  @ViewChild('details_modal') details_modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('fire_modal') fire_modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('passwordInput') passwordInput!: NgModel;

  // Open a modal
  openModal(modal: HTMLDialogElement) {
    console.log(modal);

    modal.showModal();
  }

  // Close a modal
  closeModal(modal: HTMLDialogElement) {
    modal.close();
  }

  fireEmployee(){
    this.user_service
      .fireEmployee(this.employee._id , {manager_id: localStorage.getItem('userId') , manager_password: this.password })
      .subscribe(
        value => {
          if (value.error && value.error.error.password == true) {
            this.passwordInput.control.setErrors({incorrect: true});
          }
        }
      )
  }
}
