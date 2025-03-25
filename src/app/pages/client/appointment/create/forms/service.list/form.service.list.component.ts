import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServiceInterface } from './service.interface';
import { CommonModule } from '@angular/common';
import { DatePipe , CurrencyPipe }                                 from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'form-service-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MaterialModule , CurrencyPipe],
  templateUrl: './form.service.list.component.html',
})
export class FormServiceListComponent {
  @Output() formChange = new EventEmitter<String[]>();
  @Input() services: ServiceInterface[] = [];
  @Input() init: String[] = [];

  _form = this.fb.group({
    service_ids: this.fb.control<String[]>(this.init, {
      validators: [Validators.required, Validators.minLength(1)]
    }),
    total_price: [0],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form.patchValue(this.init);
    this.form.valueChanges.subscribe(() => {
      this.emitCurrentSelection();
    });
  }

  get form():FormGroup{
    return this._form;
  }

  isServiceSelected(serviceId: String): boolean {
    return this.form.value.service_ids?.includes(serviceId) ?? false;
  }

  updateSelectedServices(index: number, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentSelection = this.form.value.service_ids || [];
    const serviceId = this.services[index]._id;
    const newSelection = isChecked
      ? [...currentSelection, serviceId]
      : currentSelection.filter(( id:String ) => id !== serviceId);
    if (newSelection.length === 0) {
      this.form.controls['service_ids'].setErrors({minLength: true})
    }
    const total = ( this.form.value.total_price || 0 ) + ( isChecked ? this.services[index].unit_price : - this.services[index].unit_price)
    this.form.patchValue({ service_ids: newSelection  , total_price: total});
  }

  private emitCurrentSelection() {
    this.formChange.emit(this.form.getRawValue() || {service_ids: [], total_price: 0});
  }
}
