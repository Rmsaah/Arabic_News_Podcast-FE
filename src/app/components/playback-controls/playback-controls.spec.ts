import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaybackControls } from './playback-controls';

describe('PlaybackControls', () => {
  let component: PlaybackControls;
  let fixture: ComponentFixture<PlaybackControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaybackControls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaybackControls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
