import { Component ,inject } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, ReactiveFormsModule, Validators ,ValidatorFn ,AbstractControl,ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppointmentCreateComponent } from './create/create.component'
import { AppointmentListComponent } from './list/appointment-list.component'

@Component({
  selector: 'app-appointment',
  imports: [ AppointmentCreateComponent , AppointmentListComponent ],
  templateUrl: './appointment.component.html',
})
export class AppointementComponent {

}
