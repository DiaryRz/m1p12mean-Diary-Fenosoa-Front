import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeItem } from './items/employee.item'
import { UserService } from 'src/app/services/user.service'
import { EmployeeListItemComponent } from './items/employee-list-item/employee-list-item.component'
import { CreateEmployeeComponent } from './items/create/create-employee.component'


@Component({
  selector: 'app-employee-list',
  imports: [EmployeeListItemComponent , CommonModule ],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  employees: EmployeeItem[];
  constructor(private userService: UserService ){}
  ngOnInit(){
    this.userService.getAllEmployee().subscribe(val => {
      this.employees = val;
    })
  }
}
