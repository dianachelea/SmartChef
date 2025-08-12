import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecipesService {
  private apiKey = environment.spoonacularApiKey;
  private apiUrl = 'https://api.spoonacular.com/recipes/complexSearch';
  private baseUrl = `${environment.apiBaseUrl}/Recipes`;
  constructor(private http: HttpClient) {}

  getRecipes(filters: any): Observable<any> {
    let params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('addRecipeInformation', 'true')
      .set('addRecipeNutrition', 'true');
    
    if (filters.query) {
      params = params.set('query', filters.query); 
    }
    if (filters.type) {
      params = params.set('type', filters.type);
    }    
    if (filters.diet) {
      params = params.set('diet', filters.diet);
    }
    if (filters.cuisine) {
      params = params.set('cuisine', filters.cuisine);
    }
    if (filters.minCalories && filters.maxCalories) {
      params = params.set('minCalories', filters.minCalories);
      params = params.set('maxCalories', filters.maxCalories);
    }
  
    if (filters.number) {
      params = params.set('number', filters.number);
    }
    if (filters.offset !== undefined) {
      params = params.set('offset', filters.offset);
    }
  
    return this.http.get(this.apiUrl, { params });
  }

  getFullRecipesByIngredients(ingredients: string[]): Observable<{ results: any[] }> {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('ingredients', ingredients.join(','));

    return new Observable(observer => {
      this.http.get<any[]>('https://api.spoonacular.com/recipes/findByIngredients', { params })
        .subscribe(findRes => {
          const ids = findRes.map(r => r.id);
          if (!ids.length) {
            observer.next({ results: [] });
            observer.complete();
            return;
          }

          const bulkParams = new HttpParams()
            .set('apiKey', this.apiKey)
            .set('ids', ids.join(','))
            .set('includeNutrition', 'true');

          this.http.get<any[]>('https://api.spoonacular.com/recipes/informationBulk', { params: bulkParams })
            .subscribe(bulkRes => {
              const lowerIngredients = ingredients.map(i => i.toLowerCase());
              const sortedResults = bulkRes
                .map(recipe => {
                  const recipeIngr = recipe.extendedIngredients.map((i: any) => i.name.toLowerCase());
                  const matchCount = lowerIngredients.filter(i => recipeIngr.includes(i)).length;
                  return { ...recipe, matchCount };
                })
                .sort((a, b) => b.matchCount - a.matchCount);

              observer.next({
                results: sortedResults.map(({ matchCount, ...rest }) => rest)
              });
              observer.complete();
            }, err => observer.error(err));
        }, err => observer.error(err));
    });
  }

  addToUserRecipes(recipe: any, isFavorite = false, isTried = false) {
    const contract = {
      title: recipe.title,
      image: recipe.image,
      serving: recipe.servings || recipe.serving || 0,
      cookingMinutes: recipe.cookingMinutes ?? 0,
      preparationMinutes: recipe.preparationMinutes ?? 0,
      readyInMinutes: recipe.readyInMinutes ?? ((recipe.cookingMinutes ?? 0) + (recipe.preparationMinutes ?? 0)),
      ingredients: recipe.ingredients 
        || recipe.extendedIngredients?.map((i: any) => i.original).join(', ') 
        || '',
      calories: recipe.calories 
        ?? recipe.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount 
        ?? 0,
      instructions: recipe.instructions || '', 
      isFavorite,
      isTried,
      spoonacularId: recipe.spoonacularId || recipe.id || 0
    };
  
    return this.http.post(`${this.baseUrl}/AddRecipe`, contract).pipe(
      catchError(err => {
        console.warn('[Handled in service]', err);
        return of({ error: err.error?.message || 'Failed to add recipe' });
      })
    );
  }
  
  deleteRecipe(recipeId: string): Observable<any> {  
    return this.http.delete(`${environment.apiBaseUrl}/Recipes/DeleteRecipe/${recipeId}`);
  }

  getUserRecipeById(id: string) {
    return this.http.get(`${environment.apiBaseUrl}/Recipes/GetById/${id}`);
  }

  getRecipeByUserAndId(userId: string, recipeId: string) {
    return this.http.get(`${environment.apiBaseUrl}/Recipes/GetByUserAndRecipeId/${userId}/${recipeId}`);
  }

  markAsFavorite(recipe: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddRecipe`, {
      ...recipe,
      isFavorite: true
    });
  }
  
  markAsTried(recipe: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/AddRecipe`, {
      ...recipe,
      isTried: true
    });
  }
  
}
