import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserServiceService, UserCredentials } from '../../core/services/user-service.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { Router } from '@angular/router';
import { RecipesService } from '../../core/services/recipes.service';
@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userId!: string;
  user!: UserCredentials;
  recipes: any[] = [];
  isSubscribed = false;
  currentUserEmail: string = localStorage.getItem('email') ?? '';
  subscriberCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private userService: UserServiceService,
    private subService: SubscriptionService,
    private router: Router,
    private recipeService: RecipesService,
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.loadData();
  }

  loadData() {
    this.userService.getUserById(this.userId).subscribe(u => {
      this.user = u;
    });
  
    this.userService.getUserRecipes(this.userId).subscribe(r => {
      this.recipes = r;
    });
  
    this.userService.getSubscribedUsers().subscribe(s => {
      this.isSubscribed = s.some(u => u.id === this.userId);
    });

    this.subService.getSubscriberCount(this.userId).subscribe(count => {
      this.subscriberCount = count;
    });
    
  }

  toggleSub() {
    this.subService.toggleSubscribe(this.userId).subscribe(() => {
      this.isSubscribed = !this.isSubscribed;
    });
  }

  openRecipeDetails(recipeId: string) {
    this.router.navigate(['/recipes', this.userId, recipeId]);
  }

  handleAddFavorite(recipeId: string) {
    const recipe = this.recipes.find(r => r.id === recipeId);
    if (!recipe) return;
  
    const safeRecipe = {
      spoonacularId: recipe.spoonacularId || 0,
      title: recipe.title,
      image: recipe.image,
      ingredients: recipe.ingredients || '',
      calories: recipe.calories || 0,
      isFavorite: true,
      isTried: false,
    };
  
    this.recipeService.addToUserRecipes(safeRecipe, true, false).subscribe({
      next: () => alert('Added to favorites!'),
      error: err => alert('Failed: ' + (err.error?.message || err.message))
    });
  }
  
  handleAddTried(recipeId: string) {
    const recipe = this.recipes.find(r => r.id === recipeId);
    if (!recipe) return;
  
    const safeRecipe = {
      spoonacularId: recipe.spoonacularId || 0,
      title: recipe.title,
      image: recipe.image,
      ingredients: recipe.ingredients || '',
      calories: recipe.calories || 0,
      isFavorite: false,
      isTried: true,
    };
  
    this.recipeService.addToUserRecipes(safeRecipe, false, true).subscribe({
      next: (res: any) => {
        if (res?.error) {
          alert(res.error);
        } else {
          alert('Marked as tried!');
        }
      },
      error: () => {} 
    });
    
    
  }
  
  
  
}
