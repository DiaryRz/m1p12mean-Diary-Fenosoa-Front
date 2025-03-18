import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EmployeeItem } from './../employee.item';


@Component({
 selector: '[app-employee-list-item]',
  imports: [DatePipe],
  templateUrl: './employee-list-item.component.html',
})
export class EmployeeListItemComponent {
 @Input() employee: EmployeeItem;
}
