import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterModal } from './register-modal';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('RegisterModal', () => {
  let component: RegisterModal;
  let fixture: ComponentFixture<RegisterModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterModal],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
