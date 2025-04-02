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
  ],
  templateUrl: './appointments.component.html',
})
export class AppointmentsComponent implements OnInit {

  constructor( private appointmentService: AppointmentService, private notificationService: NotificationService, private dateAdapter: DateAdapter<Date> ) {}

  appointments: AppointmentInterface[] = [] as AppointmentInterface[];
  filteredAppointments: AppointmentInterface[] = [];

  isFetching: boolean = false;

  searchQuery: string = '';
  filterStatus: string = '';


  applyFilters() {
  this.filteredAppointments = this.appointments.filter((appointment: AppointmentInterface ) => {
    const matchesSearch =
      appointment.id_user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      appointment.id_user.firstname.toLowerCase().includes(this.searchQuery.toLowerCase())||
      appointment.id_car.mark.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      appointment.id_car.model.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      appointment.id_car.immatriculation.toLowerCase().includes(this.searchQuery.toLowerCase())

    const matchesStatus =
      !this.filterStatus || appointment.status === this.filterStatus;

    return matchesSearch && matchesStatus;
  });
  }
  resetFilters() {
    this.searchQuery = '';
    this.filterStatus = '';
    this.applyFilters();
  }


  ngOnInit(): void {
    this.loadAppointments();

  }

  loadAppointments(): void {
    this.isFetching = true;
    this.appointmentService.listAppointments({}, {
        date_appointment: { $ne: null },
    })
      .subscribe(
        (value:any)=>{
          this.appointments = value.data.map(( apt:any ) => {
            return {...apt, date_appointment: new Date(apt.date_appointment)}
          });
          this.filteredAppointments = this.appointments;
          this.isFetching = false;
        }
      )
  }

  test(){
    this.notificationService.sendNotification(
      {
        recipient: 'user_002',
        message: {content: 'Real-time notification', title: "Rendez-vouz validé" },
      }
    );
  }
}
