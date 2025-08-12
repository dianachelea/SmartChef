import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/auth-redirect.service';
import { LoginDto } from '../../core/models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  errorMessage = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    const loginData: LoginDto = {
      email: this.email,
      password: this.password
    };

    this.authService.loginUser(loginData).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => this.errorMessage = err.message
    });
  }
}
