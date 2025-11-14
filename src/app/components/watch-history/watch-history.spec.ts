import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchHistory } from './watch-history';

describe('WatchHistory', () => {
  let component: WatchHistory;
  let fixture: ComponentFixture<WatchHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchHistory]
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
