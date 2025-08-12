import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/auth-redirect.service';
import { RecipesService } from '../../core/services/recipes.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  dropdownOpen = false;

  constructor(
    public auth: AuthenticationService,
    private router: Router,
    private recipesService: RecipesService
  ) {}

  onSearch(query: string) {
    if (!this.auth.isLogged()) {
      this.router.navigateByUrl('/login');
      return;
    }

    if (!query || query.trim().length === 0) {
      return;
    }

    this.recipesService.getRecipes({ query, number: 10 }).subscribe({
      next: (res) => {
        this.router.navigate(['/recipes'], {
          queryParams: { search: query }
        });
      },
      error: (err) => console.error('Search error', err)
    });
  }

  onProtectedAction(path: string) {
    if (this.auth.isLogged()) {
      this.router.navigateByUrl(path);
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.auth.logout();
    this.dropdownOpen = false;
    this.router.navigateByUrl('/');
  }

  navigate(path: string) {
    this.router.navigateByUrl(path);
  }
}
