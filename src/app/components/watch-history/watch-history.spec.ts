import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WatchHistory } from './watch-history';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('WatchHistory', () => {
  let component: WatchHistory;
  let fixture: ComponentFixture<WatchHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchHistory],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
