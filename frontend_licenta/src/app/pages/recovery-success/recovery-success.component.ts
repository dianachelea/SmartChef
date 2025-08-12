import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-recovery-success',
  standalone: false,
  templateUrl: './recovery-success.component.html',
  styleUrl: './recovery-success.component.scss'
})
export class RecoverySuccessComponent {
  constructor(private router: Router) { }
  
  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
