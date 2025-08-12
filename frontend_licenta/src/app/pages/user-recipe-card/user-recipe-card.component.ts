import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-recipe-card',
  standalone: false,
  templateUrl: './user-recipe-card.component.html',
  styleUrls: ['./user-recipe-card.component.scss']
})
export class UserRecipeCardComponent {
  @Input() recipe: any;
  @Input() canEdit = false;
  @Input() isOwnProfile = false;

  @Output() view = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() favorite = new EventEmitter<string>();
  @Output() tried = new EventEmitter<string>();

  addToFavorite() {
    console.log('Add to favorite:', this.recipe.id);
    this.favorite.emit(this.recipe.id);
  }

  addToTried() {
    console.log('Add to tried:', this.recipe.id);
    this.tried.emit(this.recipe.id);
  }
}
