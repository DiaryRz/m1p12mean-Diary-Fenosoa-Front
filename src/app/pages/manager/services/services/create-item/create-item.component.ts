import {
  Component, inject, OnInit,
  Output, EventEmitter }              from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormsModule }                       from '@angular/forms';
import { Observable, of  }            from 'rxjs';
import { MaterialModule }             from 'src/app/material.module';

import { ServicesService }            from 'src/app/services/services.service';

@Component({
  selector: 'create-service-item',
  imports: [MaterialModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './create-item.component.html',
})
export class CreateItemComponent {
  fb = inject(FormBuilder);
  serviceService = inject(ServicesService);
  @Output() newItemAdded = new EventEmitter<void>();

  form = this.fb.nonNullable.group({
    service_name  : ['' , Validators.required],
    unit_price    : [ Validators.required],
    time_needed   : [ Validators.required],
    ressources    : [ Validators.required],
  });

  submit(){
    this.serviceService.addService(this.form.getRawValue())
    .subscribe(value => {
        if(value.exist){
          this.form.controls['service_name'].setErrors({'exist':true})
        }
        else{
          this.newItemAdded.emit(); // Notify the parent
        }

    });
  }

}
