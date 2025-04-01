import {
  Component, OnInit,
  Input,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';
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

import { format } from "date-fns"


@Component({
  selector: 'appointment-list',
  imports:
  [
    CommonModule, FormsModule,
    MaterialModule, MatTimepickerModule,
    AppointmentItemComponent,
    // TimeStringPipe
  ],
  templateUrl: './appointment-list.component.html',
})
export class AppointmentListComponent implements OnInit {

  constructor( private appointmentService: AppointmentService, private notificationService: NotificationService, private dateAdapter: DateAdapter<Date> ) {

    const startDate = new Date()
    const endDate   = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setHours(15, 0, 0, 0);


    this.appointmentService.listTakenDates(format(startDate , "yyyy-MM-dd"), format(endDate , "yyyy-MM-dd"))
      .subscribe((value:any)=>{
        value.data.forEach((date:string)=>{
          this.disabledDates.push(new Date(date));
        })
    })

  }

  appointments: AppointmentInterface[] = [] as AppointmentInterface[];
  isFetching: boolean = false;
  @Input() waiting: boolean = false;

  disabledDates:Date[] = [
  ];

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;

    // Your existing checks for disabled dates, weekends, etc.
    const today = new Date();
    today.setHours(15, 0, 0, 0);

    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
    oneMonthFromNow.setHours(15, 0, 0, 0);

    if (date < today || date > oneMonthFromNow) return false;

    const day = date.getDay();
    if (day === 0 || day === 6) return false;

    return !this.disabledDates.some(disabledDate =>
      this.dateAdapter.compareDate(date, disabledDate) === 0
    );
  }


  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.isFetching = true;
    this.appointmentService.listAppointments(this.waiting  == true ? {waiting:true} : {verified:true})
      .subscribe(
        (value:any)=>{
          //console.log(value);

          this.appointments = value.data.map(( apt:any ) => {
            return {...apt, date_appointment: new Date(apt.date_appointment)}
          });
          //console.log(this.appointments);
          this.isFetching = false;
        }
      )
  }

    // Open a modal
  openModal(modal: HTMLDialogElement) {
    //console.log(modal);

    modal.showModal();
  }

  // Close a modal
  closeModal(modal: HTMLDialogElement) {
    modal.close();
  }

}
