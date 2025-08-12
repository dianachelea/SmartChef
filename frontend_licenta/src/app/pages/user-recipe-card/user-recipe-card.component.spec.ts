import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecipeCardComponent } from './user-recipe-card.component';

describe('UserRecipeCardComponent', () => {
  let component: UserRecipeCardComponent;
  let fixture: ComponentFixture<UserRecipeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRecipeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRecipeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
