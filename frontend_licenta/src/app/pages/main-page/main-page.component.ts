import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/auth-redirect.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main-page',
  standalone: false,
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent {
  constructor(private router: Router, public auth: AuthenticationService,private http: HttpClient) {}

  goIfLoggedIn(path: string) {
    if (this.auth.isLogged()) {
      this.router.navigateByUrl(path);
    } else {
      this.router.navigateByUrl('/login');
    }
  }
  handleSmartUpload(): void {
    if (!this.auth.isLogged()) {
      this.router.navigateByUrl('/login');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await this.http.post<{ ingredients: string[] }>(
          'http://localhost:5089/api/upload/detect',
          formData
        ).toPromise();

        const ingredients = res?.ingredients || [];
        if (ingredients.length > 0) {
          localStorage.setItem('detectedIngredients', JSON.stringify(ingredients));
          this.router.navigate(['/recipes/confirm']);
        } else {
          alert('No ingredients detected.');
        }
      } catch (err) {
        alert('Error detecting ingredients.');
        console.error(err);
      }
    };

    input.click();
  }
  navigateToMeal(mealType: string) {
    if (this.auth.isLogged()) {
      this.router.navigate(['/recipes'], {
        queryParams: { mealType }
      });
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}