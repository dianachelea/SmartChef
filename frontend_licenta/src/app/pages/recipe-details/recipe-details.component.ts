import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from '../../core/services/recipes.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss'],
  standalone: false
})
export class RecipeDetailsComponent implements OnInit {
  @Input() recipe: any;
  @Input() isFromProfile = false;
  @Input() isMine = false;

  calories: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipesService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId');
    const recipeId = this.route.snapshot.paramMap.get('recipeId');
    const localId = this.route.snapshot.paramMap.get('id');
  
    if (userId && recipeId) {
      this.recipeService.getRecipeByUserAndId(userId, recipeId).subscribe((data: any) => {
        const currentEmail = localStorage.getItem('email');
        this.recipe = {
          ...data,
          extendedIngredients: data.ingredients?.split(',').map((i: string) => ({ original: i.trim() })) || []
        };
      
        this.calories = data.calories ?? 0;
        this.isFromProfile = true;
        this.isMine = data.authorEmail === currentEmail;
      });      
    } else {
      const navRecipe = history.state.recipe;
      const isSavedRecipe = localId?.includes('-');
  
      if (isSavedRecipe) {
        this.isFromProfile = true;
        if (navRecipe) {
          this.recipe = {
            ...navRecipe,
            extendedIngredients: navRecipe.ingredients?.split(',').map((i: string) => ({ original: i.trim() })) || []
          };
          this.calories = navRecipe.calories ?? 0;
          this.isMine = true;
        } else {
          this.recipeService.getUserRecipeById(localId!).subscribe((data: any) => {
            this.recipe = {
              ...data,
              extendedIngredients: data.ingredients?.split(',').map((i: string) => ({ original: i.trim() })) || []
            };
            this.calories = data.calories ?? 0;
            this.isMine = true;
          });
        }
      } else {
        this.http.get(`https://api.spoonacular.com/recipes/${localId}/information?includeNutrition=true&apiKey=5e029357d7e64a479bca8938d3b212c2`)
          .subscribe((data: any) => {
            this.recipe = {
              ...data,
              extendedIngredients: data.extendedIngredients || [],
            };
            this.calories = this.extractCalories(data);
            this.isMine = false;
          });
      }
    }
  }
  
  extractCalories(data: any): number {
    return data?.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0;
  }

  getCalorieLabel(calories: number): string {
    if (calories <= 300) return 'A';
    if (calories <= 600) return 'B';
    if (calories <= 900) return 'C';
    return 'D';
  }

  getCalorieClass(calories: number): string {
    return this.getCalorieLabel(calories);
  }

  deleteRecipe() {
    if (confirm('Delete this recipe?')) {
      this.recipeService.deleteRecipe(this.recipe.id).subscribe(() => {
        alert('Recipe deleted!');
        this.router.navigate(['/dashboard/my-recipes']);
      });
    }
  }

  modifyRecipe() {
    const id = this.recipe?.id;
  
    if (!id || typeof id !== 'string' || !id.includes('-')) {
      alert("You can only modify recipes saved in your profile.");
      return;
    }
  
    this.router.navigate(['/dashboard/edit-recipe', id]);
  }
  

  addToFavorites() {
    this.saveRecipeToBackend(true, false);
  }

  addToTried() {
    this.saveRecipeToBackend(false, true);
  }

  saveRecipeToBackend(isFavorite: boolean, isTried: boolean) {
    const safeRecipe = {
      ...this.recipe,
      cookingMinutes: this.recipe.cookingMinutes ?? 0,
      preparationMinutes: this.recipe.preparationMinutes ?? 0
    };

    this.recipeService.addToUserRecipes(safeRecipe, isFavorite, isTried).subscribe({
      next: () => alert(isFavorite ? 'Added to favorites!' : 'Marked as tried!'),
      error: err => alert(err.error?.message || err.message || 'Failed')
    });
  }
}
