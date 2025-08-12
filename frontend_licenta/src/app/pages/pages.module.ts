import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MainPageComponent } from './main-page/main-page.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TestimonialCardsComponent } from './main-page/testimonial-cards/testimonial-cards.component';
import { TestimonialSliderComponent } from './main-page/testimonial-slider/testimonial-slider.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RecoverySuccessComponent } from './recovery-success/recovery-success.component';
import { AboutComponent } from './about/about.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ThanksComponent } from './thanks/thanks.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';
import { MySubscribesComponent } from './my-subscribes/my-subscribes.component';
import { RouterModule } from '@angular/router';
import { UserRecipeCardComponent } from './user-recipe-card/user-recipe-card.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { CommunityComponent } from './community/community.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ConfirmIngredientsComponent } from './confirm-ingredients/confirm-ingredients.component';
@NgModule({
    declarations: [
      MainPageComponent,
      TestimonialCardsComponent,
      TestimonialSliderComponent,
      LoginComponent,
      RegisterComponent,
      ForgotPasswordComponent,
      RecoverySuccessComponent,
      AboutComponent,
      ContactUsComponent,
      ThanksComponent,
      RecipesComponent,
      ResetPasswordComponent,
      RecipeDetailsComponent,
      UserDashboardComponent,
      MyRecipesComponent,
      MySubscribesComponent,
      UserRecipeCardComponent,
    EditRecipeComponent,
      AddRecipeComponent,
      CommunityComponent,
      UserProfileComponent,
      ConfirmIngredientsComponent
    ],
    imports: [
      CommonModule,
      SharedModule,
      MatCardModule,
      MatIconModule,
      MatButtonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule
    ],
    exports: [MainPageComponent]
  })
  export class PagesModule {}
  