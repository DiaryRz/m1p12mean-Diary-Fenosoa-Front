import { Component , OnInit } from '@angular/core';
import { EmployeeItem } from './items/employee.item'

@Component({
  selector: 'app-employee-list',
  imports: [],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  private employees: EmployeeItem[];

  ngOnInit(){

  }

}
