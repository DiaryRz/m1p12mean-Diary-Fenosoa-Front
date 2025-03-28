import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module'

import { MatTimepickerModule } from '@angular/material/timepicker';
import { DateAdapter } from '@angular/material/core';

import { TimeStringPipe } from 'src/app/pipe/time-string.pipe'

import { AppointmentService } from 'src/app/services/appointment.service';
import { AppointmentInterface } from './appointment.interface';

import { NotificationService } from 'src/app/services/notification.service';



import { AppointmentItemComponent } from './items/item.component';


@Component({
  selector: 'appointments',
  standalone: true,
  imports:
  [
    CommonModule, FormsModule,
    MaterialModule, MatTimepickerModule,
    AppointmentItemComponent,
    // TimeStringPipe
  ],
  templateUrl: './appointments.component.html',
})
export class AppointmentsComponent implements OnInit {
  constructor( private appointmentService: AppointmentService, private notificationService: NotificationService, private dateAdapter: DateAdapter<Date> ) {}
  appointments: AppointmentInterface[] = [] as AppointmentInterface[];
  isFetching: boolean = false;
  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isFetching = true;
    this.appointmentService.listAppointments(true)
      .subscribe(
        (value:any)=>{
          this.appointments = value.data.map(( apt:any ) => {
            return {...apt, date_appointment: new Date(apt.date_appointment)}
          });
          console.log(this.appointments);
          this.isFetching = false;
        }
      )
  }

  test(){
    this.notificationService.sendNotification(
      {
        recipient: 'user_002',
        message: {content: 'Real-time notification', title: "Test notif" },
      }
    );
  }
}
