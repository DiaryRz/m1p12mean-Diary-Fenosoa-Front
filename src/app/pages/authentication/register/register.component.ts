import { CoreService } from 'src/app/services/core.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { Component ,inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators ,ValidatorFn ,AbstractControl,ValidationErrors } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of  } from 'rxjs';
 // Date Picker
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { TablerIconsModule } from 'angular-tabler-icons';
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

 // Date Picker
import { AuthService } from '../../../../app/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule , TablerIconsModule],
  templateUrl: './register.component.html',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMAT },
  ],
})
export class AppSideRegisterComponent implements OnInit {
  options = this.settings.getOptions();

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  maxDate = new Date(new Date().getFullYear()-18 , new Date().getMonth() , new Date().getDate())

  form = this.fb.nonNullable.group({
    login_field : ['mail', Validators.required],
    name : ['' , Validators.required],
    firstname : ['' , Validators.required],
    birth_date : ['' , Validators.required],
    CIN : ['' , [Validators.required , Validators.maxLength(12) , Validators.minLength(12)]],
    gender : ['masculin' , Validators.required],
    mail: ['', [Validators.required, Validators.email ]],
    phone: ['' ,Validators.required],
    password: ['', Validators.required],
    password_confirm: ['',[  Validators.required , this.validateSamePassword]],
  });

  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('password_confirm');
    return password?.value == confirmPassword?.value ? null : { 'notSame': true };
  }


  constructor(private settings: CoreService) {
  }
  ngOnInit(){

    const CINField = this.form.get('CIN');
    if (CINField) {
      CINField.valueChanges.subscribe(value => {
        if (value && value.length > 12 ) {
          CINField.setValue(value.slice(0 , 12), { emitEvent: false });
        } else {
          const filteredValue = value.replace(/[^0-9]/g, '');
          if (filteredValue !== value) {
            CINField.setValue(filteredValue, { emitEvent: false });
          }
        }
      });
    }


    const phone_numberField = this.form.get('phone');

    if (phone_numberField) {
      phone_numberField.valueChanges.subscribe(value => {
        if (!value) return; // Skip if empty
        let filteredValue = value.replace(/[^0-9]/g, '');
        filteredValue = filteredValue.replace(/^261/g,'');

        if (filteredValue.startsWith('0')) {
          filteredValue = filteredValue.substring(1);
        }
        if (filteredValue !== value) {
          phone_numberField.setValue(filteredValue, { emitEvent: false });
        }
      });
    }
  }

  test(){
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);
      //console.log(controlName + " : " +control?.value);
      if (control?.errors) {
        console.log('Control name with error: ', controlName);
        console.log('Error details: ', control.errors);
      }
    });
  }
  submit() {


    let { mail, phone , CIN , name , firstname , password , gender , birth_date} = this.form.getRawValue();
    if (phone && !phone.startsWith('261')) {
     phone = '261' + phone;
    }

    this.authService.register(
      {
        role_id: 'role_002',
        CIN:CIN ,password: password ,
        gender: gender ,
        birth_date: birth_date ,
        mail: mail ,
        phone: phone ,
        name: name ,
        firstname : firstname
      }
    ).subscribe((response) => {
        //console.log('response', response);
      if (response.field !== undefined ) {
        if (response.field.CIN == true) {
          this.form.controls['CIN'].setErrors({'incorrect': true});
        }
        if (response.field.phone == true) {
          this.form.controls['phone'].setErrors({'incorrect': true});
        }
        if (response.field.mail == true) {
          this.form.controls['mail'].setErrors({'incorrect': true});
        }
        return;
      }
      if (response.success) {
        this.router.navigateByUrl('/login');
      }
    });
  }
}
