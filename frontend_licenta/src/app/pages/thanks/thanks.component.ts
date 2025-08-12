import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-thanks',
  standalone: false,
  templateUrl: './thanks.component.html',
  styleUrl: './thanks.component.scss'
})
export class ThanksComponent {
  constructor(private router: Router) {}
  goToHome() {
    this.router.navigateByUrl('/');
  }
}
