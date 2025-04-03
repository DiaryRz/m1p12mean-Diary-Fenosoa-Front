import {
  Component, OnInit,
  Input,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';
import { DateAdapter } from '@angular/material/core';

import { AppointmentListComponent } from './list/appointment-list.component';

import { AppointmentInterface } from './list/appointment.interface';

import { AppointmentService } from 'src/app/services/appointment.service';


@Component({
  selector: 'mechanics-appointments',
  imports: [AppointmentListComponent],
  templateUrl: './appointments.component.html',
})
export class AppointmentsComponent implements OnInit {
  today = new Date();
  tomorrow = new Date();

  appointments: AppointmentInterface[] = [];
  filteredAppointmentsToDepositedToday  : AppointmentInterface[] = [];
  filteredAppointmentsToWorkedOn        : AppointmentInterface[] = [];

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
    this.appointmentService.listAppointments({ }, { status: 'confirmé' , date_appointment: { $ne: null}  } )
      .subscribe(
        (value:any)=>{
          this.appointments = value.data.map(( apt:any ) => {
            return {...apt, date_appointment: new Date(apt.date_appointment)}
          });
          this.filteredAppointmentsToDepositedToday = this.appointments.filter((apt: AppointmentInterface) => {
            const isSameDay = this.dateAdapter.compareDate(apt.date_appointment, this.today) === 0;
            const notDepositedYet = apt.date_deposition == null;
            return isSameDay && notDepositedYet; // Assuming you want 'deposited' status
          });
          this.filteredAppointmentsToWorkedOn = this.appointments.filter((apt: AppointmentInterface) => {
            const isSameDay = apt.date_deposition != null ?  this.dateAdapter.compareDate(new Date(apt.date_deposition), this.today) == 0 : false;
            return isSameDay; // Assuming you want 'deposited' status
          });


        }
      )
  }
  test(){
    console.log(this.filteredAppointmentsToWorkedOn)
  }


}
