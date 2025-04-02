/* import { Component ,inject } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, ReactiveFormsModule, Validators ,ValidatorFn ,AbstractControl,ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AppointmentListComponent } from './list/appointment-list.component.ts'

@Component({
  selector: 'app-appointment',
  imports: [ AppointmentCreateComponent , AppointmentListComponent ],
  templateUrl: './appointment.component.html',
})
export class AppointementComponent {

} */

import {
  Component, OnInit,
  Input,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';
import { DateAdapter } from '@angular/material/core';

import { AppointmentCreateComponent } from './create/create.component'

import { AppointmentListComponent } from './list/appointment-list.component';

import { AppointmentInterface } from './list/appointment.interface';

import { AppointmentService } from 'src/app/services/appointment.service';


@Component({
  selector: 'mechanics-appointments',
  imports: [AppointmentListComponent, AppointmentCreateComponent],
  templateUrl: './appointments.component.html',
})
export class AppointmentsComponent implements OnInit {
  today = new Date();
  tomorrow = new Date();

  appointments: AppointmentInterface[] = [];
  filteredAppointmentsNeedHalf  : AppointmentInterface[] = [];
  filteredAppointmentsNeedDate        : AppointmentInterface[] = [];

  constructor(private appointmentService: AppointmentService,
   private dateAdapter: DateAdapter<Date> ) {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0); // Start of today (00:00:00.000)

    this.tomorrow = new Date(this.today);
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
  }

  ngOnInit(){
    this.loadAppointments()
  }

  loadAppointments(): void {
    this.appointmentService.listAppointments({ }, { id_user : localStorage.getItem('userId') || '' } )
      .subscribe(
        (value:any)=>{
          this.appointments = value.data.map(( apt:any ) => {
            return {...apt, date_appointment: new Date(apt.date_appointment)}
          });

          this.filteredAppointmentsNeedHalf = this.appointments.filter((apt: AppointmentInterface) => {
            const need_pay_half = apt.status == 'validé' && apt.total_payed == 0;
            const hasDate = apt.date_appointment.valueOf() > 0;
            return need_pay_half&& hasDate; // Assuming you want 'deposited' status
          });

          this.filteredAppointmentsNeedDate = this.appointments.filter((apt: AppointmentInterface) => {
            const hasDate = apt.date_appointment.valueOf() <= 0;
            return hasDate
          });

          console.log(this.filteredAppointmentsNeedDate , this.filteredAppointmentsNeedHalf);

        }
      )
  }
  test(){
    console.log(this.filteredAppointmentsNeedDate)
  }
}
