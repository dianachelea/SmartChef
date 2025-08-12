import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthenticationService } from '../../core/services/auth-redirect.service';
import { mustContainAtLeastOneSpecialCharacter } from '../utils-validators/utils-validators.component';
import { ResultError, StatusCodes } from '../../core/models/result.model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: false
})
export class ResetPasswordComponent implements OnInit {
  token!: string;
  hide = true;
  firstSubmited = false;
  showPassword = false;
  logginInfo: ResultError = { status: StatusCodes.Info, message: '' };

  form: FormGroup = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      mustContainAtLeastOneSpecialCharacter
    ])
  });

  constructor(
    private readonly authService: AuthenticationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (!params['token']) {
        this.router.navigateByUrl('/unauthorized');
        return;
      }
      this.token = params['token'];
    });
  }
  

  onSubmit() {
    this.firstSubmited = true; 
    if (this.form.invalid) return;
  
    const newPassword = this.form.value.password;
  
    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Password reset error:', err);
        this.logginInfo = {
          status: StatusCodes.Error,
          message: 'Password reset failed. Please try again.'
        };
      }
    });
  }
  
  
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  
}
