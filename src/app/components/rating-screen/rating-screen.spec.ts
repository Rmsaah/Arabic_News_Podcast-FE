import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingScreen } from './rating-screen';

describe('RatingScreen', () => {
  let component: RatingScreen;
  let fixture: ComponentFixture<RatingScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RatingScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
