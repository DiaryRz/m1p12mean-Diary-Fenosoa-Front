import {
  Component, OnInit,
  Input,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MaterialModule } from 'src/app/material.module';
import { AppointmentCreateComponent } from './create/create.component'
import { AppointmentInterface } from './appointment.interface';
import { AppointmentService } from 'src/app/services/appointment.service';


@Component({
  selector: 'mechanics-appointments',
  imports: [AppointmentCreateComponent , MaterialModule],
  templateUrl: './appointments.component.html',
})
export class AppointmentsComponent implements OnInit {
  today = new Date();
  tomorrow = new Date();

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  totalItems = 0;
  isFetching: boolean = false;

  appointments: AppointmentInterface[] = [];
  filteredAppointmentsNeedHalf        : AppointmentInterface[] = [];
  filteredAppointmentsNeedDate        : AppointmentInterface[] = [];
  filteredAppointmentsNeedRest        : AppointmentInterface[] = [];

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
          console.log(value);

          this.totalPages = value.data.pagination.totalPages;
          this.totalItems = value.data.pagination.totalDocuments;
          this.isFetching = false;

          this.appointments = value.data.data.map(( apt:any ) => {
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

          this.filteredAppointmentsNeedRest = this.appointments.filter((apt: AppointmentInterface) => {
            const need_pay_rest = ( apt.status == 'finie' && apt.total_payed != apt.total_price ) || apt.status == 'payé';
            return need_pay_rest; // Assuming you want 'deposited' status
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
    console.log(this.filteredAppointmentsNeedDate)
  }
}
