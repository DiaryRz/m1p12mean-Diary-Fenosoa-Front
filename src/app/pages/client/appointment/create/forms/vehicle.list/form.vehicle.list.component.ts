import { Component ,inject, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators ,ValidatorFn ,AbstractControl,ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { EngineType , CarInterface } from 'src/app/pages/client/cars/create/car.interface'

@Component({
  selector: 'form-vehicle-list',
  imports: [ FormsModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './form.vehicle.list.component.html',
})
export class FormVehicleListComponent {

  @Output() formChange = new EventEmitter<any>();
  @Input() mulitstep = false;

  @Input() vehicles: CarInterface[] = [];
  @Input() init: CarInterface = {} as CarInterface;

  _form = this.fb.nonNullable.group({
   data: [this.init , [Validators.required, Validators.minLength(1)] ]
  })


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

  isVehicleSelected(car_id: String): boolean {
    return ( this.form.value.data?._id == car_id );
  }

  updateSelectedVehicles(index: number, event: Event) {
    this.form.patchValue({ data: this.vehicles[index] });
  }


  private emitCurrentSelection() {
    this.formChange.emit(this.form.getRawValue() || {data : this.init});
  }

}
