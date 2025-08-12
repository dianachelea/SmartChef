import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-ingredients',
  standalone: false,
  templateUrl: './confirm-ingredients.component.html',
  styleUrls: ['./confirm-ingredients.component.scss']
})
export class ConfirmIngredientsComponent {
  ingredients: string[] = [];
  newIngredient: string = '';
  substitutes: { [ingredient: string]: string[] } = {};

  constructor(private router: Router) {
    const raw = localStorage.getItem('detectedIngredients');
    this.ingredients = raw ? JSON.parse(raw) : [];
  }
  ngOnInit() {
    const raw = localStorage.getItem('detectedIngredients');
    this.ingredients = raw ? JSON.parse(raw) : [];
  
    this.ingredients.forEach(ingredient => {
      this.fetchSubstitutes(ingredient);
    });
  }
  fetchSubstitutes(ingredient: string) {
    const apiKey = '5e029357d7e64a479bca8938d3b212c2';
    const url = `https://api.spoonacular.com/food/ingredients/substitutes?ingredientName=${ingredient}&apiKey=${apiKey}`;
  
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.substitutes[ingredient] = data.substitutes || [];
      });
  }

  removeIngredient(index: number) {
    this.ingredients.splice(index, 1);
  }
  
  removeSubstitute(ingredient: string, index: number) {
    this.substitutes[ingredient].splice(index, 1);
  }
  
  findRecipes() {
    localStorage.setItem('confirmedIngredients', JSON.stringify(this.ingredients));
    this.router.navigate(['/recipes'], {
      queryParams: { from: 'ingredients' }
    });
  }

  addIngredient() {
    const value = this.newIngredient.trim();
    if (value && !this.ingredients.includes(value)) {
      this.ingredients.push(value);
      this.newIngredient = '';
    }
  }

}
