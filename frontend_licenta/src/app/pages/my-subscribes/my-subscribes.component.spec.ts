import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySubscribesComponent } from './my-subscribes.component';

describe('MySubscribesComponent', () => {
  let component: MySubscribesComponent;
  let fixture: ComponentFixture<MySubscribesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MySubscribesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySubscribesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
