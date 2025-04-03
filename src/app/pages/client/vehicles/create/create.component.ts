import { Component ,inject, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, FormGroup ,ReactiveFormsModule, Validators ,ValidatorFn ,AbstractControl,ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CarCategoryService } from 'src/app/services/car-category.service'
import { VehicleService } from 'src/app/services/vehicle.service'
import { EngineType , VehicleInterface } from './vehicle.interface'



@Component({
  selector: 'vehicle-create',
  imports: [ FormsModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
})
export class VehicleCreateComponent implements OnInit {
  @Output() formChange = new EventEmitter<any>();
  @Output() formSubmit = new EventEmitter<void>();
  @Input() mulitstep = false;
  @Input() init: VehicleInterface = {} as VehicleInterface;

  _form = this.fb.nonNullable.group({
    date_creation: [ new Date, [ Validators.required ] ],
    category_id: [ '', [ Validators.required ] ],
    immatriculation: [ '', [ Validators.required ] ],
    mark: [ '', [ Validators.required ] ],
    model: [ '' , [ Validators.required ] ],
    place_number:[ 2 ,  [ Validators.required ] ],
    engine_fuel_Type:[ '', [ Validators.required ] ],
    user_id: [ localStorage.getItem('userId'), [ Validators.required ] ],
  })


  private vehicleService = inject(VehicleService);
  private car_categ_service  =inject(CarCategoryService);
  categs: any[];
  engines_Type: any[] = Object
    .values(EngineType);

  constructor(private fb: FormBuilder ){
    this.form.valueChanges.subscribe((value) => {
      this.formChange.emit(value);
    });
  }

  ngOnInit(){
    this.form.patchValue(this.init);
    this.list_categories();
  }

  async  checkExist(): Promise<boolean> {
    try {
      const value = await this.vehicleService.getByPlate(this.form.value.immatriculation).toPromise();

      if (value?.immatriculation === this.form.value.immatriculation) {
        this.form.controls['immatriculation'].setErrors({ exist: true });
        return true; // Invalid (exists)
      }
      return false; // Valid (doesn't exist)
    } catch (error) {
      //console.error('Error checking plate:', error);
      return false; // Fallback (handle as needed)
    }
  }

  submit(){
    this.formSubmit.emit()
  }

  get form(): FormGroup{
    return this._form;
  }

  markAllAsTouched() {
    this.form.markAllAsTouched();
  }

  list_categories(){
    this.car_categ_service.listCarCategories().subscribe(
      ( value:any ) =>{
        this.categs=value;
      }
    )

  }

}
