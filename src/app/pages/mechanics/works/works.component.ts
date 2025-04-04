import {
  Component, OnInit,
  Input,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MaterialModule } from 'src/app/material.module'
import { AppointmentListComponent } from './list/appointment-list.component';
import { AppointmentInterface } from './list/appointment.interface';
import { AppointmentService } from 'src/app/services/appointment.service';


@Component({
  selector: 'mechanics-appointments',
  imports: [AppointmentListComponent, MaterialModule],
  templateUrl: './works.component.html',
})
export class AppointmentsWorksComponent implements OnInit {
  today = new Date();
  tomorrow = new Date();

  appointments: AppointmentInterface[] = [];
  filteredAppointmentsToWorkedOn        : AppointmentInterface[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  totalItems = 0;
  isFetching: boolean = false;

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
          this.appointments = value.data.data.map(( apt:any ) => {
            return {...apt, date_appointment: new Date(apt.date_appointment)}
          });
          this.totalPages = value.data.pagination.totalPages;
          this.totalItems = value.data.pagination.totalDocuments;
          this.isFetching = false;

          this.filteredAppointmentsToWorkedOn = this.appointments.filter((apt: AppointmentInterface) => {
            const isSameDay = apt.date_deposition != null ?  this.dateAdapter.compareDate(new Date(apt.date_deposition), this.today) == 0 : false;
            return isSameDay; // Assuming you want 'deposited' status
          });


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

  test(){
    console.log(this.filteredAppointmentsToWorkedOn)
  }


}
