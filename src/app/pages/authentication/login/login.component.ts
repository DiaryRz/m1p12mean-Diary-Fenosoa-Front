import { Component ,OnInit ,inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute , RouterModule } from '@angular/router';
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
export class AppSideLoginComponent implements OnInit{
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  cookieService = inject(CookieService);
  constructor(private activatedroute:ActivatedRoute) {}
  data: any;

  isSubmitting :boolean = false;

  ngOnInit() {
    this.activatedroute.data.subscribe(data => {
      this.data=data;
    })
  }
  form = this.fb.nonNullable.group({
    mail: ['' , [ Validators.email , Validators.required ]],
    phone: [''],
    password: ['', Validators.required],
  });

  submit() {

  if (this.form.invalid) {
    return;
  }

  this.isSubmitting = true;
    this.authService.login(
      {mail:this.form.getRawValue().mail, phone: this.form.getRawValue().phone , password:this.form.getRawValue().password , roles : this.data.roles }
      ).subscribe((response) => {
        console.log(response);

        if (response.error !== undefined ) {
          if (response.error.password == true) {
            this.form.controls['password'].setErrors({'incorrect': true});
          }
          if (response.error.mail == true) {
            this.form.controls['mail'].setErrors({'incorrect': true});
          }
          this.isSubmitting = false;
          return;
        }

        localStorage.setItem('userId', response.userId)
        localStorage.setItem('role', response.role)
        localStorage.setItem('refreshToken', response.refreshToken)
        localStorage.setItem('accessToken', response.accessToken)

        this.router.navigateByUrl(response.role);

        this.isSubmitting = false;
    });
  }
}
