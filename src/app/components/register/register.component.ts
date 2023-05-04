import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  //inject
  constructor(
    private builder: FormBuilder,
    private service: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  registerform = this.builder.group({
    id: this.builder.control(
      '',
      Validators.compose([Validators.required, Validators.minLength(5)])
    ),
    name: this.builder.control('', Validators.required),
    password: this.builder.control(
      '',
      Validators.compose([
        Validators.required,
        Validators.pattern(
          '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
        ),
      ])
    ),
    email: this.builder.control(
      '',
      Validators.compose([Validators.required, Validators.email])
    ),
    gender: this.builder.control('male'),
    role: this.builder.control(''),
    isactive: this.builder.control(false),
  });

  proceedregister() {
    if (this.registerform.valid) {
      //if the information in the form is valid, we call the api
      this.service.RegisterUser(this.registerform.value).subscribe((result) => {
        this.toastr.success(
          'Please contact admin for enable access.',
          'Registered successfully'
        ); //success popup
        this.router.navigate(['login']); //redirect to login page
      });
    } else {
      this.toastr.warning('Please enter valid data.');
    }
  }
}
