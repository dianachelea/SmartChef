import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeDetailsComponent } from '../recipe-details/recipe-details.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.scss'],
  standalone: false
  
})
export class MyRecipesComponent implements OnInit {
  selected = 'all';
  recipes: any[] = [];
  filteredRecipes: any[] = [];
  stats: any[] = [];
  currentPage = 1;
  recipesPerPage = 4;
  
  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit() {
    this.loadRecipes();
  }

  loadRecipes() {
    const token = localStorage.getItem('token'); 
    this.http.get<any[]>('http://localhost:5089/Recipes/GetByUser/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe((res) => {
      this.recipes = res;
      this.filteredRecipes = [...res];
      this.computeStats();
    });
    
  }
  

  filter(type: string) {
    this.selected = type;
    if (type === 'favorite') {
      this.filteredRecipes = this.recipes.filter(r => r.isFavorite);
    } else if (type === 'tried') {
      this.filteredRecipes = this.recipes.filter(r => r.isTried);
    } else if (type === 'mine') {
      this.filteredRecipes = this.recipes.filter(r => !r.isTried && !r.isFavorite);
    } else {
      this.filteredRecipes = [...this.recipes];
    }
  }

  computeStats() {
    const triedMine = this.recipes.filter(r => r.isTried || (!r.isFavorite && !r.isTried));
    const count = triedMine.length || 1;

    const countByClass = { A: 0, B: 0, C: 0, D: 0 };
    for (const r of triedMine) {
      const c = r.calories;
      if (c <= 300) countByClass.A++;
      else if (c <= 600) countByClass.B++;
      else if (c <= 900) countByClass.C++;
      else countByClass.D++;
    }

    this.stats = Object.entries(countByClass).map(([label, c]) => ({
      label,
      count: c,
      percent: ((c / count) * 100).toFixed(1)
    }));
  }

  viewRecipe(recipe: any) {
    this.router.navigate([`/dashboard/my-recipes/${recipe.id}`], {
      state: { recipe }
    });
  }

  
  deleteRecipe(recipe: any) {
    if (confirm('Delete this recipe?')) {
      this.http.delete(`http://localhost:5089/Recipes/DeleteRecipe/${recipe.id}`).subscribe({
        next: () => {
          this.recipes = this.recipes.filter(r => r.id !== recipe.id);
          this.filteredRecipes = this.filteredRecipes.filter(r => r.id !== recipe.id);
          this.computeStats();
        },
        error: err => {
          console.error(err);
          alert("Failed to delete recipe.");
        }
      });
    }
  }
  
  editRecipe(recipe: any) {
    this.router.navigate(['/dashboard/edit-recipe', recipe.id]);
  }
  get paginatedRecipes() {
    const start = (this.currentPage - 1) * this.recipesPerPage;
    const end = start + this.recipesPerPage;
    return this.filteredRecipes.slice(start, end);
  }
  
  get totalPages() {
    return Math.ceil(this.filteredRecipes.length / this.recipesPerPage);
  }
  
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
  
  prevPage() {
    this.goToPage(this.currentPage - 1);
  }
  addNewRecipe() {
    this.router.navigate(['/dashboard/add-recipe']);
  }
  
  
}
