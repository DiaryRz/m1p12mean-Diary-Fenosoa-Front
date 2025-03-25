import { Component ,inject, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, FormGroup ,ReactiveFormsModule, Validators ,ValidatorFn ,AbstractControl,ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CarCategoryService } from 'src/app/services/car-category.service'
import { CarService } from 'src/app/services/car.service'
import { EngineType , CarInterface } from './car.interface'



@Component({
  selector: 'car-create',
  imports: [ FormsModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
})
export class CarCreateComponent implements OnInit {
  @Output() formChange = new EventEmitter<any>();
  @Output() formSubmit = new EventEmitter<void>();
  @Input() mulitstep = false;
  @Input() init: CarInterface = {} as CarInterface;

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


  private carService = inject(CarService);
  private car_categ_service  =inject(CarCategoryService);
  categs: any[];
  engines_Type: any[] = Object
    .values(EngineType);

  constructor(private fb: FormBuilder ){
    this._form.valueChanges.subscribe((value) => {
      this.formChange.emit(value);
    });

  }

  ngOnInit(){
    this.form.patchValue(this.init);
    this.list_categories();
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
