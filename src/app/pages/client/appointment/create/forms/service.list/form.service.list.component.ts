import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder,FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServiceInterface } from './service.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'form-service-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MaterialModule],
  templateUrl: './form.service.list.component.html',
})
export class FormServiceListComponent {
  @Output() formChange = new EventEmitter<String[]>();
  @Input() services: ServiceInterface[] = [];

  _form = this.fb.group({
    service_ids: this.fb.control<String[]>([], {
      validators: [Validators.required, Validators.minLength(1)]
    })
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
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

  updateSelectedServices(serviceId: String, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentSelection = this.form.value.service_ids || [];
    const newSelection = isChecked
      ? [...currentSelection, serviceId]
      : currentSelection.filter(( id:String ) => id !== serviceId);

    if (newSelection.length === 0) {
      this.form.controls['service_ids'].setErrors({minLength: true})
    }
    this.form.patchValue({ service_ids: newSelection });
  }

  private emitCurrentSelection() {
    this.formChange.emit(this.form.value.service_ids || []);
  }
}
