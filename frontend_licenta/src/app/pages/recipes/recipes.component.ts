import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipesService } from './../../core/services/recipes.service';
import { HttpClient } from '@angular/common/http';

interface Recipe {
  id: number;
  image: string;
  title: string;
  calories: number;
  readyInMinutes: number;
}

@Component({
  selector: 'app-recipes',
  standalone: false,
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  sortBy: string = 'name';
  selectedFilters: { [key: string]: string } = {};
  selectedCalorieClass: string = '';
  openSections: string[] = [];
  isIngredientBased = false;
  currentPage: number = 1;
  pageSize: number = 6;
  totalResults: number = 0;

  dietCategories = [
    { label: 'Vegetarian', value: 'vegetarian' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Gluten-Free', value: 'gluten free' },
    { label: 'Ketogenic', value: 'ketogenic' },
    { label: 'Paleo', value: 'paleo' },
    { label: 'Low FODMAP', value: 'low fodmap' },
    { label: 'Whole30', value: 'whole30' }
  ];

  cuisineCategories = [
    { label: 'Italian', value: 'italian' },
    { label: 'Chinese', value: 'chinese' },
    { label: 'Indian', value: 'indian' },
    { label: 'French', value: 'french' },
    { label: 'Mexican', value: 'mexican' },
    { label: 'Japanese', value: 'japanese' },
    { label: 'Greek', value: 'greek' },
    { label: 'American', value: 'american' },
    { label: 'Middle Eastern', value: 'middle eastern' },
    { label: 'Thai', value: 'thai' }
  ];

  mealCategories = [
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Brunch', value: 'brunch' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
    { label: 'Snack', value: 'snack' },
    { label: 'Dessert', value: 'dessert' },
    { label: 'Appetizer', value: 'appetizer' },
    { label: 'Soup', value: 'soup' },
    { label: 'Beverage', value: 'beverage' }
  ];

  calorieClasses = [
    { class: 'A', range: '0–300 kcal', min: 0, max: 300 },
    { class: 'B', range: '301–600 kcal', min: 301, max: 600 },
    { class: 'C', range: '601–900 kcal', min: 601, max: 900 },
    { class: 'D', range: '900+ kcal', min: 901, max: 99999 }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipesService: RecipesService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedFilters = {};
      const storedSections = localStorage.getItem('openSections');
      this.openSections = storedSections ? JSON.parse(storedSections) : [];

      this.isIngredientBased = params['from'] === 'ingredients';

      ['type', 'diet', 'cuisine', 'ingredientBased'].forEach(type => {
        if (params[type]) {
          this.selectedFilters[type] = params[type];
          const section = this.getSectionFromCategory(type);
          if (!this.openSections.includes(section)) {
            this.openSections.push(section);
          }
        }
      });

      localStorage.setItem('openSections', JSON.stringify(this.openSections));

      this.selectedCalorieClass = params['calorieClass'] || '';
      this.currentPage = +params['page'] || 1;

      const minCalories = +params['minCalories'] || 0;
      const maxCalories = +params['maxCalories'] || Number.MAX_SAFE_INTEGER;

      if (this.isIngredientBased) {
        const raw = localStorage.getItem('confirmedIngredients');
        const confirmedIngredients = raw ? JSON.parse(raw) : [];

        if (confirmedIngredients.length > 0) {
          this.recipesService.getFullRecipesByIngredients(confirmedIngredients)
            .subscribe(({ results }) => {
              const allResults = results
                .map((r: any) => {
                  const caloriesEntry = r.nutrition?.nutrients?.find((n: any) => n.name === 'Calories');
                  return {
                    id: r.id,
                    image: r.image,
                    title: r.title,
                    calories: caloriesEntry?.amount ?? 0,
                    readyInMinutes:
                      typeof r.readyInMinutes === 'number' && r.readyInMinutes > 0
                        ? r.readyInMinutes
                        : (r.preparationMinutes || r.cookingMinutes || null)
                  };
                })
                .filter((recipe: Recipe) =>
                  recipe.calories >= minCalories && recipe.calories <= maxCalories
                )
                .sort((a: Recipe, b: Recipe) =>
                  this.sortBy === 'name' ? a.title.localeCompare(b.title) : 0
                );

              this.totalResults = allResults.length;
              const offset = (this.currentPage - 1) * this.pageSize;
              this.recipes = allResults.slice(offset, offset + this.pageSize);
            });
          return;
        }
      }

      this.fetchRecipes(params);
    });
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalResults / this.pageSize);
  }

  getVisiblePages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: (number | string)[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else if (total <= 10) {
      pages.push(1, 2, '...', total - 1, total);
    } else {
      pages.push(1, 2);
      if (current > 4) pages.push('...');

      const midStart = Math.max(3, current - 1);
      const midEnd = Math.min(total - 2, current + 1);

      for (let i = midStart; i <= midEnd; i++) {
        pages.push(i);
      }

      if (current < total - 3) pages.push('...');
      pages.push(total - 1, total);
    }

    return pages;
  }

  getSectionFromCategory(type: string): string {
    const map: Record<string, string> = {
      type: 'meal',
      diet: 'diet',
      cuisine: 'cuisine',
      ingredientBased: 'ingredient'
    };
    return map[type] || '';
  }

  toggleSection(section: string): void {
    if (this.openSections.includes(section)) {
      this.openSections = this.openSections.filter(s => s !== section);
    } else {
      this.openSections.push(section);
    }
  }

  isSectionOpen(section: string): boolean {
    return this.openSections.includes(section);
  }

  filterBy(type: string, value: string) {
    const currentParams = { ...this.route.snapshot.queryParams };
    if (currentParams[type] === value) {
      delete currentParams[type];
    } else {
      currentParams[type] = value;
    }

    currentParams['page'] = 1;
    this.router.navigate(['/recipes'], { queryParams: currentParams });
  }

  filterByCalories(className: string) {
    this.selectedCalorieClass = className;
    const selectedClass = this.calorieClasses.find(c => c.class === className);
    if (!selectedClass) return;

    this.router.navigate(['/recipes'], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        calorieClass: className,
        minCalories: selectedClass.min,
        maxCalories: selectedClass.max,
        page: 1
      }
    });
  }

  onCaloriesClassChange() {
    if (!this.selectedCalorieClass) {
      const updatedParams = { ...this.route.snapshot.queryParams };
      delete updatedParams['calorieClass'];
      delete updatedParams['minCalories'];
      delete updatedParams['maxCalories'];
      delete updatedParams['page'];

      this.router.navigate(['/recipes'], {
        queryParams: updatedParams
      });
    } else {
      this.filterByCalories(this.selectedCalorieClass);
    }
  }
  
  isActive(type: string, value: string): boolean {
    return this.selectedFilters[type] === value;
  }

  isActiveCalories(className: string): boolean {
    return this.selectedCalorieClass === className;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.router.navigate([], {
      queryParams: {
        ...this.route.snapshot.queryParams,
        page: page
      }
    });
  }

  goToPageNumber(page: number | string): void {
    if (typeof page === 'number') {
      this.goToPage(page);
    }
  }

  fetchRecipes(filters: any = {}): void {
    const minCalories = +filters.minCalories || 0;
    const maxCalories = +filters.maxCalories || Number.MAX_SAFE_INTEGER;
    const offset = (this.currentPage - 1) * this.pageSize;
  
    const apiFilters: any = {
      number: this.pageSize,
      offset: offset,
      addRecipeInformation: true,
      addRecipeNutrition: true,
      minCalories: minCalories,
      maxCalories: maxCalories
    };
  
    if (filters.search) {
      apiFilters.query = filters.search; 
    }
  
    if (filters.type) {
      apiFilters.type = filters.type;
    }
    
    if (filters.diet) {
      apiFilters.diet = filters.diet;
    }
    if (filters.cuisine) {
      apiFilters.cuisine = filters.cuisine;
    }
  
    this.recipesService.getRecipes(apiFilters).subscribe(res => {
      this.totalResults = res.totalResults || 100;
  
      this.recipes = res.results
      .map((r: any) => ({
        id: r.id,
        image: r.image,
        title: r.title,
        calories: r.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 0,
        readyInMinutes: r.readyInMinutes,
        cookingMinutes: r.cookingMinutes || 0,
        preparationMinutes: r.preparationMinutes || 0
      }))
        .filter((recipe: Recipe) => recipe.calories >= minCalories && recipe.calories <= maxCalories)
        .sort((a: Recipe, b: Recipe) => this.sortBy === 'name' ? a.title.localeCompare(b.title) : 0);
    });
  }
  
  goBackToAll() {
    this.router.navigate(['/recipes']);
  }
  
  onSmartSuggestionClick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
  
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
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
            alert("No ingredient detected in image.");
          }
        } catch (err) {
          console.error("Detection error:", err);
          alert("An error occurred while detecting ingredients.");
        }
      }
    };
  
    input.click();
  }
  
  openRecipe(id: number) {
    this.router.navigate(['/recipes', id]);
  }
  
  addToFavorites(recipe: any) {
    this.http.get(`https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=true&apiKey=5e029357d7e64a479bca8938d3b212c2`)
      .subscribe((fullData: any) => {
        const safeRecipe = {
          ...fullData,
          cookingMinutes: fullData.cookingMinutes ?? 0,
          preparationMinutes: fullData.preparationMinutes ?? 0
        };
  
        this.recipesService.addToUserRecipes(safeRecipe, true, false).subscribe({
          next: () => alert('Added to favorites!'),
          error: err => alert('Failed: ' + (err.error?.message || err.message))
        });
      });
  }
  
  addToTried(recipe: any) {
    this.http.get(`https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=true&apiKey=5e029357d7e64a479bca8938d3b212c2`)
      .subscribe((fullData: any) => {
        const safeRecipe = {
          ...fullData,
          cookingMinutes: fullData.cookingMinutes ?? 0,
          preparationMinutes: fullData.preparationMinutes ?? 0
        };
  
        this.recipesService.addToUserRecipes(safeRecipe, false, true).subscribe({
          next: () => alert('Marked as tried!'),
          error: err => alert('Failed: ' + (err.error?.message || err.message))
        });
      });
  }
  
}
