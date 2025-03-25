import { Component ,inject, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, ReactiveFormsModule, Validators ,ValidatorFn ,AbstractControl,ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { EngineType , CarInterface } from 'src/app/pages/client/cars/create/car.interface'

@Component({
  selector: 'form-vehicule-list',
  imports: [ FormsModule, ReactiveFormsModule],
  templateUrl: './form.vehicule.list.component.html',
})
export class FormVehiculeListComponent {

  constructor(private fb :FormBuilder ){}
  @Output() formChange = new EventEmitter<any>();
  @Input() mulitstep = false;

  @Input() vehicules = [];

  form = this.fb.nonNullable.group({
   id: ['' , Validators.required ]
  })


}
