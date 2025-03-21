import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeItem } from './items/employee.item'
import { UserService } from 'src/app/services/user.service'
import { MaterialModule } from 'src/app/material.module'
import { FormsModule } from '@angular/forms';
import { EmployeeListItemComponent } from './items/employee-list-item/employee-list-item.component'
import { CreateEmployeeComponent } from './items/create/create-employee.component'


@Component({
  selector: 'app-employee-list',
  imports: [EmployeeListItemComponent , CreateEmployeeComponent , MaterialModule, CommonModule , FormsModule],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  employees: EmployeeItem[];
  filteredEmployees: EmployeeItem[] = [];

  searchQuery: string = '';
  filterRole: string = '';

  isFetching: boolean = true;

  my_id :String = localStorage.getItem('userId') || ""

  constructor(private userService: UserService ){}

  applyFilters() {
    this.filteredEmployees = this.employees.filter((employee:EmployeeItem) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        employee.firstname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        employee.CIN.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesRole =
        !this.filterRole || employee.role_id.role_name === this.filterRole;

      return matchesSearch && matchesRole;
    });
  }
  resetFilters() {
    this.searchQuery = '';
    this.filterRole = '';
    this.applyFilters();
  }

  ngOnInit(){
    this.isFetching = true;
    this.userService.getAllEmployee().subscribe((val) => {
      this.employees = val;
      this.filteredEmployees = val;
      this.isFetching = false;
    });
  }
}
