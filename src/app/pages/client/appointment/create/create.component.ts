import { Component ,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, ReactiveFormsModule, Validators ,ValidatorFn ,AbstractControl,ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { CarCreateComponent } from 'src/app/pages/client/cars/create/create.component';

@Component({
  selector: 'appointment-create',
  imports: [CarCreateComponent, CommonModule],
  templateUrl: './create.component.html',
})
export class AppointmentCreateComponent {

  constructor(private fb :FormBuilder){}

  currentStep = 1;
  totalSteps = 3;

  formData:any;

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
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


  onCarFormChange(formData: any ){
    this.formData = { ...this.formData, ...formData };
  }

  onServiceFormChange(formData: any ){
    this.formData = { ...this.formData, ...formData };
  }

}
