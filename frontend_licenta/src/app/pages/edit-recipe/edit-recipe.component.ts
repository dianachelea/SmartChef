import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute, Route, Router} from '@angular/router';

@Component({
  selector: 'app-edit-recipe',
  standalone: false,
  templateUrl: './edit-recipe.component.html',
  styleUrl: './edit-recipe.component.scss'
})

export class EditRecipeComponent implements OnInit {
  form!: FormGroup;
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private http: HttpClient, private router:Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    this.form = this.fb.group({
      id: [''],
      title: [''],
      calories: [0],
      image: [''],
      preparationMinutes: [0],
      cookingMinutes: [0],
      readyInMinutes: [0],
      serving: [1],
      ingredients: [''],
      instructions: [''],
      isFavorite: [false],
      isTried: [false],
      spoonacularId: [0]
    });
    
  
    this.http.get(`http://localhost:5089/Recipes/GetById/${id}`).subscribe((recipe: any) => {
      this.form.patchValue(recipe);
    });
  }

  onSubmit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.http.put(`http://localhost:5089/Recipes/UpdateRecipe/${id}`, this.form.value)
      .subscribe(() => {
        alert('Recipe updated!');
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
