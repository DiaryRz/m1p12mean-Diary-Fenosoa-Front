import { Component } from '@angular/core';
import { EmployeeItem } from '../employee.item.ts'

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
})
export class DetailsComponent {
  private data: EmployeeItem;

}
