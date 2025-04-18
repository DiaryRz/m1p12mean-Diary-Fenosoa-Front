import {
  Component, OnInit,
  Input, Output,
  EventEmitter,
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
import { ConfigService } from 'src/app/services/config.service';
import { NotificationService } from 'src/app/services/notification.service';

import { AppointmentInterface } from './appointment.interface';

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

  constructor(
    private appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    private dateAdapter: DateAdapter<Date> ) {

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

  private config:any = {} as any;

  isFetching: boolean = false;
  @Input() appointments: AppointmentInterface[] = [] as AppointmentInterface[];
  @Input() conditions : any = {};
  @Input() context : string = '';
  @Output() refetch = new EventEmitter<void>();
  @Input() filteredAppointments: AppointmentInterface[] = [] as AppointmentInterface[];


  disabledDates:Date[] = [
  ];

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    // Your existing checks for disabled dates, weekends, etc.
    const today = new Date();
    today.setHours(this.config.after_hour_appointment.getHours(), this.config.after_hour_appointment.getMinutes(), 0, 0);

    const lastDay = new Date();
    lastDay.setDate(lastDay.getDate() + this.config.offset_date_appointment);
    lastDay.setHours(this.config.after_hour_appointment.getHours(), this.config.after_hour_appointment.getMinutes(), 0, 0);

    if (date < today || date > lastDay) return false;

    const day = date.getDay();
    if (day === 0 || day === 6) return false;

    return !this.disabledDates.some(disabledDate =>
      this.dateAdapter.compareDate(date, disabledDate) === 0
    );
  }

  timeFilter : { min: number , max: number };

  ngOnInit(): void {
    this.configService.getConfig().subscribe((value:any)=>{
      this.config = {...value, after_hour_appointment: new Date(value.after_hour_appointment)};
    })
    this.applyFilters()
  }

  searchQuery: string = '';
  filterStatus: string = '';
  filterDate: {start?: Date , end?: Date} = {};

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

      if (this.filterDate.start !== undefined && this.filterDate.end !== undefined) {
        const matchesDate =
          (
            this.dateAdapter.compareDate(appointment.date_appointment , this.filterDate.start) >= 0 &&
            this.dateAdapter.compareDate(appointment.date_appointment , this.filterDate.end) <= 0
          )
            ||
          (
            this.dateAdapter.compareDate(appointment.date_deposition || new Date() , this.filterDate.start) >= 0 &&
            this.dateAdapter.compareDate(appointment.date_deposition || new Date() , this.filterDate.end) <= 0
          )
        return matchesSearch && matchesStatus && matchesDate;
      }
      return matchesSearch && matchesStatus;
    });
  }

  resetFilters() {
    this.searchQuery = '';
    this.filterStatus = '';
    this.filterDate = {};
    this.applyFilters();
  }
}
