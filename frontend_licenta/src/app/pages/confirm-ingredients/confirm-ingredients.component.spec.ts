import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmIngredientsComponent } from './confirm-ingredients.component';

describe('ConfirmIngredientsComponent', () => {
  let component: ConfirmIngredientsComponent;
  let fixture: ComponentFixture<ConfirmIngredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmIngredientsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmIngredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
