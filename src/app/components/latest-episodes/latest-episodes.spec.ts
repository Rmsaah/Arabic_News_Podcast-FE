import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestEpisodes } from './latest-episodes';

describe('LatestEpisodes', () => {
  let component: LatestEpisodes;
  let fixture: ComponentFixture<LatestEpisodes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestEpisodes]
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
