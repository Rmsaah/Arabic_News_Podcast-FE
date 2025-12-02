import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProfileModal } from './edit-profile-modal';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('EditProfileModal', () => {
  let component: EditProfileModal;
  let fixture: ComponentFixture<EditProfileModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProfileModal],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditProfileModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
