import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EpisodeList } from './episode-list';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EpisodeList', () => {
  let component: EpisodeList;
  let fixture: ComponentFixture<EpisodeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodeList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EpisodeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
