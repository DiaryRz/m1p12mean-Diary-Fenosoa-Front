import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';

import { MatTimepickerModule } from '@angular/material/timepicker';
import { DateAdapter } from '@angular/material/core';

import { VehicleCreateComponent } from 'src/app/pages/client/vehicles/create/create.component';
import { FormVehicleListComponent } from './forms/vehicle.list/form.vehicle.list.component'
import { FormServiceListComponent } from './forms/service.list/form.service.list.component'


import { AppointmentService } from 'src/app/services/appointment.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { ConfigService } from 'src/app/services/config.service';
import { CarCategoryService } from 'src/app/services/car-category.service';
import { ServicesService } from 'src/app/services/services.service';
import { NotificationService } from 'src/app/services/notification.service';

import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MinutesToHoursPipe } from 'src/app/pipe/minutes-to-hours.pipe'
import { FindPipe } from 'src/app/pipe/find.pipe'

import { format } from 'date-fns'


@Component({
  selector: 'appointment-create',
  imports: [
    VehicleCreateComponent, FormVehicleListComponent ,
    FormServiceListComponent,
    CommonModule, FormsModule,
    MaterialModule, MatTimepickerModule,
    MinutesToHoursPipe, FindPipe
  ],
  templateUrl: './create.component.html',
})
export class AppointmentCreateComponent {

  @ViewChild('vehicleForm') vehicleForm!: VehicleCreateComponent;
  @ViewChild('vehicleListForm') vehicleListForm!: FormVehicleListComponent;
  @ViewChild('serviceListForm') serviceListForm!: FormServiceListComponent;

  private config:any = {} as any;

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
  timeFilter : { min: number, max: number};


  currentStep = 1;
  prevStep = 1;
  prevSelectionType = '';
  totalSteps = 5;

  formData = {
    selectionType: null as 'existing' | 'new' | null,
    car_data: {} as any,
    services_data: {} as any,
    appointment_data: {} as any,
  };

  services_list = [];
  vehicles_list = [];

  constructor(
    private appointmentService: AppointmentService,
    private vehicleService: VehicleService,
    private carCategoryService: CarCategoryService,
    private serviceService: ServicesService,
    private notificationService: NotificationService,
    private configService: ConfigService ,
    private dateAdapter: DateAdapter<Date>
  ) {

    this.configService.getConfig().subscribe((value:any)=>{
      this.config = {...value, after_hour_appointment: new Date(value.after_hour_appointment)};
      this.timeFilter = {
        min:  new Date().setHours(6,0,0,0),
        max: new Date().setHours(this.config.after_hour_appointment.getHours(), this.config.after_hour_appointment.getMinutes(), 0, 0)
      }
    })
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

  listExistingVehicles() {
    const client_id = localStorage.getItem('userId') || '';
    this.vehicleService.listClientVehicles(client_id)
      .subscribe((value:any)=>{
        this.vehicles_list = value;
      });
  }

  listServices() {
    this.serviceService.listServices()
    .subscribe((value:any)=>{
      //console.log(value);
      this.services_list = value;
    });
  }

  print(value:any){
    //console.log(value)
  }

  async nextStep() {
    if (this.currentStep >= this.totalSteps) {
      return
    }

    if (this.currentStep === 2 && this.formData.selectionType === 'new') {
      if(await this.vehicleForm.checkExist())
        return;
    }

    this.prevStep =this.currentStep;
    this.currentStep++;

    if (this.currentStep === 2 && this.formData.selectionType === 'existing') {
      this.listExistingVehicles();
    }

    if (this.currentStep === 2 && this.formData.selectionType === 'new') {
      this.prevSelectionType =this.formData.selectionType;
      // Check if form is invalid
      if (this.vehicleForm?.form?.invalid) {
      this.vehicleForm.form.markAllAsTouched();
      return;
      }

      // Verify license plate doesn't exist
      try {
          const response = await this.vehicleService.getByPlate(this.formData.car_data.immatriculation).toPromise();

          if (response?.error?.success === true) {
            this.vehicleForm.form.controls['immatriculation'].setErrors({ exist: true });
            this.currentStep--;
            return;
          }

      } catch (error) {
        return;
      }
    }

    if (this.currentStep === 3) {
      if (this.formData.selectionType === 'new') {
        // fetch categ;
        this.carCategoryService.getCarCategory(this.formData.car_data.category_id)
          .subscribe(
            (value:any)=>{
              this.formData.car_data.category_id = value;
            }
          )
      }

      this.listServices();
      if (this.serviceListForm?.form?.invalid) {
        this.serviceListForm.form.markAllAsTouched();
        this.currentStep++;
        return;
      }
    }
    if (this.currentStep === 4) {
      this.formData.appointment_data = {
        id_user: localStorage.getItem('userId'),
        services: this.formData.services_data.service_ids,
        label_price: this.formData.services_data.total_price,
        label_duration: this.formData.services_data.duration,
      }
      //console.log(this.formData);
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
    if (this.currentStep  === 2) {
      this.formData.services_data = {};
    }

  }

  submitForm() {
    if (this.currentStep == this.totalSteps){
      if(this.formData.selectionType == 'new'){
        this.vehicleService.addVehicle(this.formData.car_data)
          .subscribe((value:any)=>{
            this.formData.appointment_data.id_car = value._id;
        });
      }

      if(this.formData.selectionType == 'existing'){
        this.formData.appointment_data.id_car = this.formData.car_data._id
      }

      this.formData.appointment_data.date_reservation_request = new Date();

      this.appointmentService.createAppointment(this.formData.appointment_data)
        .subscribe((value:any)=>{
          if(this.formData.appointment_data.date_appointment){
            const content =
              `Un rendez-vous à été demander pour le ${this.formData.appointment_data.date_appointment}`;
            this.notificationService.sendNotification(
              {
                to_role: "manager",
                message: {content: content, title: "Demande de rendez-vous" },
              }
            );
            this.formData.appointment_data = {}
            this.formData.car_data = {}
            this.formData.services_data = {}
            this.currentStep = 1;
          }
        })
    }
  }

  onSelectionTypeChange(newType: 'existing' | 'new') {
    // Clear car_data when switching between new/existing
    if (this.formData.selectionType && this.formData.selectionType !== newType) {
      this.formData.car_data = {};
    }
    this.formData.selectionType = newType;
  }

  format_date(date:number ,f:string){
    return format(new Date(date), f)
  }

  isNextDisabled(): boolean {
    switch (this.currentStep) {
      case 1:
        return !this.formData.selectionType;
      case 2:
          return ( this.vehicleListForm?.form?.invalid || this.vehicleForm?.form?.invalid) ?? false;
      case 3:
          return this.serviceListForm?.form?.invalid ?? false;
      default:
        return false;
    }
  }
}
