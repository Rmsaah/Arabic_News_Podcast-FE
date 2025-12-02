import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaybackControls } from './playback-controls';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('PlaybackControls', () => {
  let component: PlaybackControls;
  let fixture: ComponentFixture<PlaybackControls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaybackControls],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
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
