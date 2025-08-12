import { Component } from '@angular/core';
import { AuthenticationService } from '../../core/services/auth-redirect.service';
@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private authRedirect: AuthenticationService) {}

  onProtectedAction(path: string) {
    this.authRedirect.goIfLoggedIn(path);
  }
}
