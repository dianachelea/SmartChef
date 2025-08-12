import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RecipesService } from '../../core/services/recipes.service';

@Component({
  selector: 'app-add-recipe',
  templateUrl: '../edit-recipe/edit-recipe.component.html',
  styleUrls: ['../edit-recipe/edit-recipe.component.scss'],
  standalone: false
})
export class AddRecipeComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private recipesService: RecipesService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [''],
      image: [''],
      serving: [1],
      readyInMinutes: [0],
      cookingMinutes: [0],
      preparationMinutes: [0],
      ingredients: [''],
      calories: [0],
      isFavorite: [false],
      isTried: [false],
      spoonacularId: [0],
      instructions: ['']
    });
  }
  
  onSubmit() {
    this.recipesService.addToUserRecipes(this.form.value)
      .subscribe(() => {
        alert('Recipe added!');
        this.router.navigate(['/dashboard/my-recipes']);
      });
  }

  onCancel() {
    this.router.navigate(['/dashboard/my-recipes']);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }
}
