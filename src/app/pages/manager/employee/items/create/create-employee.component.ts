import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Component ,inject ,OnInit} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators ,ValidatorFn ,AbstractControl,ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Observable, of  } from 'rxjs';
 // Date Picker
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

export const CUSTOM_DATE_FORMAT = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    },
};


import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'create-employee',
  templateUrl: './create-employee.component.html',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMAT },
  ],
})
export class CreateEmployeeComponent implements OnInit {

  fb = inject(FormBuilder);
  employeeService = inject(UserService);
  router = inject(Router);
  maxDate = new Date(new Date().getFullYear()-18 , new Date().getMonth() , new Date().getDate())

  form = this.fb.nonNullable.group({
    name : ['' , Validators.required],
    firstname : ['' , Validators.required],
    birth_date : ['' , Validators.required],
    CIN : ['' , [Validators.required , Validators.maxLength(12) , Validators.minLength(12) , Validators.pattern('^[0-9]*$')]],
    gender : ['masculin' , Validators.required],
    mail: ['', [Validators.required, Validators.email ]],
    phone: ['' ,Validators.required],
    role_id: ['role_003' ,Validators.required],
    password: ['', Validators.required],
    password_confirm: ['',[  Validators.required , this.validateSamePassword]],
  });

  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('password_confirm');
    return password?.value == confirmPassword?.value ? null : { 'notSame': true };
  }


  ngOnInit(){
    const CINField = this.form.get('CIN');
    if (CINField) {
      CINField.valueChanges.subscribe(value => {
        if (value) {
          const filteredValue = value.replace(/[^0-9]/g, '');
          if (filteredValue !== value) {
            CINField.setValue(filteredValue, { emitEvent: false });
          }
        }
      });
    }
  }

  test(){
    let value:Array<any> = [];
    let error:Array<any> =[];
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);
      value.push(controlName + " : " +control?.value);
      if (control?.errors) {
        error.push(control?.errors);
        /* //console.log('Control name with error: ', controlName);
        //console.log('Error details: ', control.errors); */
      }
    });
    //console.log(value);
    //console.log(error);

  }
  submit() {
    const { mail, phone , CIN , name , firstname , role_id , password , gender , birth_date} = this.form.getRawValue();
    this.employeeService.createEmployee(
      {
        role_id: role_id,
        CIN:CIN ,password: password ,
        gender: gender ,
        birth_date: birth_date ,
        mail: mail ,
        phone: phone ,
        name: name ,
        firstname : firstname
      }
    ).subscribe((response) => {
      if (response.error !== undefined ) {
        if (response.error.field.CIN == true) {
          this.form.controls['CIN'].setErrors({'incorrect': true});
        }
        if (response.error.field.phone == true) {
          this.form.controls['phone'].setErrors({'incorrect': true});
        }
        if (response.error.field.mail == true) {
          this.form.controls['mail'].setErrors({'incorrect': true});
        }
        return;
      }
      if (response.success) {
        this.router.navigateByUrl('/manager/employee');
      }
    });
  }
}
