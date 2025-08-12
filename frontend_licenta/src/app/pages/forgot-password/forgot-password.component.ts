import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/auth-redirect.service';
@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  email = '';
  errorMessage = '';
  success = false;

  constructor(private router: Router, private authService: AuthenticationService) { }

  onRecover() {
    this.authService.recoverPassword(this.email).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => 
          this.router.navigateByUrl('/recovery-success'), 2000);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.success = false;
      }
    });
  }
}
