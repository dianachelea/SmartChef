import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { RecoverySuccessComponent } from './pages/recovery-success/recovery-success.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ThanksComponent } from './pages/thanks/thanks.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RecipeDetailsComponent } from './pages/recipe-details/recipe-details.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { MyRecipesComponent } from './pages/my-recipes/my-recipes.component';
import { MySubscribesComponent } from './pages/my-subscribes/my-subscribes.component';
import { EditRecipeComponent } from './pages/edit-recipe/edit-recipe.component';
import { AddRecipeComponent } from './pages/add-recipe/add-recipe.component';
import { ConfirmIngredientsComponent } from './pages/confirm-ingredients/confirm-ingredients.component';
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: MainPageComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'about', component: AboutComponent},
      { path: 'thanks', component: ThanksComponent },
      { path: 'recipes', component: RecipesComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'recipes/confirm', component: ConfirmIngredientsComponent },
      { path: 'recipes/:id', component: RecipeDetailsComponent },
      {
        path: 'recipes/:userId/:recipeId',
        component: RecipeDetailsComponent
      },
      {
        path: 'dashboard',
        component: UserDashboardComponent,
        children: [
          { path: '', redirectTo: 'my-recipes', pathMatch: 'full' },
          { path: 'my-recipes', component: MyRecipesComponent },
          { path: 'my-subscribes', component: MySubscribesComponent },
          { 
            path: 'my-recipes/:id', 
            component: RecipeDetailsComponent, 
            data: { isFromProfile: true } 
          },
          {
            path: 'edit-recipe/:id',
            component: EditRecipeComponent
          },
          {
            path: 'add-recipe',
            component: AddRecipeComponent
          },
          {
            path: 'my-subscribes',
            component: MySubscribesComponent
          },
          
        ]
      },
      {
        path: 'community',
        loadChildren: () => import('../app/pages/community/community-routig.model').then(m => m.CommunityRoutingModule)
      }
    ]
  }, 
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'recovery-success',
    component: RecoverySuccessComponent
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent
  }
  
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
