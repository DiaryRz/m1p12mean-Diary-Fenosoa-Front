import { Component ,inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { AuthService } from '../../../../app/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  cookieService = inject(CookieService);

  form = this.fb.nonNullable.group({
    mail: ['' , [ Validators.email , Validators.required ]],
    phone: [''],
    password: ['', Validators.required],
  });

  submit() {
    this.authService.login(
      {mail:this.form.getRawValue().mail, phone: this.form.getRawValue().phone , password:this.form.getRawValue().password , role : 'role_002' }
      ).subscribe((response) => {
        if (response.error !== undefined ) {
          if (response.error.password == true) {
            this.form.controls['password'].setErrors({'incorrect': true});
          }
          if (response.error.mail == true) {
            this.form.controls['mail'].setErrors({'incorrect': true});
          }
          return;
        } else {
          localStorage.setItem('userId', response.userId)
          localStorage.setItem('refreshToken', response.refreshToken)
          localStorage.setItem('accessToken', response.accessToken)
          this.router.navigateByUrl('/client');
        }
    });
  }
}
