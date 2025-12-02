import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LatestEpisodes } from './latest-episodes';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';

describe('LatestEpisodes', () => {
  let component: LatestEpisodes;
  let fixture: ComponentFixture<LatestEpisodes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestEpisodes],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestEpisodes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
