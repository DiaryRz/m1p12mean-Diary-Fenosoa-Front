import {
  Component, inject, OnInit,
  Output, EventEmitter }              from '@angular/core';
import {
  FormBuilder,
  FormGroup,
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

  _form = this.fb.nonNullable.group({
    service_name  : [ '' , Validators.required],
    unit_price    : [ Validators.required],
    time_needed   : [ Validators.required],
    need_mult     : [ false, Validators.required],
    ressources    : [ Validators.required],
  });

  get form(): FormGroup {
    return this._form;
  }

  submit(){
    let value = this.form.getRawValue();
    value.need_mult || true
    this.serviceService.addService(value)
    .subscribe(value => {
        if(value.exist){
          this._form.controls['service_name'].setErrors({'exist':true})
        }
        else{
          this.newItemAdded.emit(); // Notify the parent
        }

    });
  }

}
