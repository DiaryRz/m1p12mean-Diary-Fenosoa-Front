import { Component } from '@angular/core';
import { CarCreateComponent } from './create/create.component';

@Component({
  selector: 'app-cars',
  imports: [ CarCreateComponent ],
  templateUrl: './cars.component.html',
})
export class CarsComponent {

}
