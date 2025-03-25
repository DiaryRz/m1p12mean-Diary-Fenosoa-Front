import { Component, ViewChild, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';

import { CarCreateComponent } from 'src/app/pages/client/cars/create/create.component';
import { FormVehiculeListComponent } from './forms/vehicule.list/form.vehicule.list.component'
import { FormServiceListComponent } from './forms/service.list/form.service.list.component'
import { CarService } from 'src/app/services/car.service';
import { ServicesService } from 'src/app/services/services.service';

import { Observable,of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'appointment-create',
  imports: [ CarCreateComponent, FormVehiculeListComponent , FormServiceListComponent, CommonModule ,FormsModule ,MaterialModule],
  templateUrl: './create.component.html',
})
export class AppointmentCreateComponent {
  @ViewChild('vehicleForm') vehicleForm!: CarCreateComponent;
  @ViewChild('vehicleListForm') vehicleListForm!: FormVehiculeListComponent;
  @ViewChild('serviceListForm') serviceListForm!: FormServiceListComponent;

  currentStep = 1;
  totalSteps = 5;

  formData = {
    selectionType: null as 'existing' | 'new' | null,
    car_data: {} as any,
    services_data: [] as any[],
    appointment_data: {} as any,
  };


  services_list = [];
  vehicules_list = [];
  constructor(private carService: CarService , private serviceService: ServicesService) {}


  listExistingVehicules() {
    const client_id = localStorage.getItem('userId') || '';
    this.carService.listClientCars(client_id)
      .subscribe((value:any)=>{
        console.log(value);
        this.vehicules_list = value;
      });
  }

  listServices() {
    this.serviceService.listServices()
    .subscribe((value:any)=>{
      console.log(value);
      this.services_list = value;
    });
  }

  async nextStep() {
    if (this.currentStep >= this.totalSteps) {
      return
    }

    this.currentStep++;
    if (this.currentStep === 3) {
      this.listServices();
      if (this.serviceListForm?.form?.invalid) {
        this.serviceListForm.form.markAllAsTouched();
        this.currentStep++;
        return;
      }
    }

    if (this.currentStep === 2 && this.formData.selectionType === 'existing') {
      this.listExistingVehicules();
    }

    if (this.currentStep === 2 && this.formData.selectionType === 'new') {
      // Check if form is invalid
      if (this.vehicleForm?.form?.invalid) {
      this.vehicleForm.form.markAllAsTouched();
      return;
      }

      // Verify license plate doesn't exist
      try {
          const response = await this.carService.getByPlate(this.formData.car_data.immatriculation).toPromise();

          if (response?.error?.success === true) {
            this.vehicleForm.form.controls['immatriculation'].setErrors({ exist: true });
            this.currentStep--;
            return;
          }

      } catch (error) {
        console.error('Error checking license plate:', error);
        return;
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitForm() {
    console.log('Form Data:', this.formData);
    // Handle form submission
  }

  isNextDisabled(): boolean {
    switch (this.currentStep) {
      case 1:
        return !this.formData.selectionType;
      case 2:
          return this.vehicleForm?.form?.invalid ?? false;
      case 3:
          return this.serviceListForm?.form?.invalid ?? false;
      default:
        return false;
    }
  }
}
