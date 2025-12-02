import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingScreen } from './rating-screen';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('RatingScreen', () => {
  let component: RatingScreen;
  let fixture: ComponentFixture<RatingScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingScreen],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
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
