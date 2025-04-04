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

import { PaginatedResponse } from 'src/app/pages/pagination.interface'


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
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  totalItems = 0;
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
      appointment.id_car.immatriculation.toLowerCase().includes(this.searchQuery.toLowerCase())||
      appointment.ticket_recup?.toLowerCase().includes(this.searchQuery.toLowerCase());

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
        {
        next: (response: { success: boolean , data: PaginatedResponse<any> }) => {
          console.log(response);
          this.appointments = response.data.data.map(( apt:any ) => {
            return {...apt, date_appointment: new Date(apt.date_appointment)}
          });
          this.totalPages = response.data.pagination.totalPages;
          this.totalItems = response.data.pagination.totalDocuments;
          this.isFetching = false;
          this.filteredAppointments = this.appointments;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
          this.isFetching = false;
        }
      }
      )
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAppointments();
  }

  onItemsPerPageChange(items: number): void {
    this.itemsPerPage = items;
    this.currentPage = 1; // Reset to first page when changing items per page
    this.loadAppointments();
  }
}
