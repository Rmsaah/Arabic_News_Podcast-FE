import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthModalService } from '../../services/auth-modal.service';
import { AuthService } from '../../services/auth.service';
import { UserRegistrationRequestDto } from '../../models/episode.model';

@Component({
  selector: 'app-register-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-modal.html',
  styleUrl: './register-modal.css'
})
export class RegisterModal {
  isVisible = signal<boolean>(false);
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  constructor(
    private authModalService: AuthModalService,
    private authService: AuthService,
    private router: Router
  ) {
    // Subscribe to modal visibility
    this.authModalService.showRegisterModal$.subscribe(show => {
      this.isVisible.set(show);
      if (show) {
        // Reset form when opened
        this.resetForm();
      }
    });
  }

  closeModal(): void {
    this.authModalService.closeRegister();
  }

  switchToLogin(): void {
    this.authModalService.openLogin();
  }

  onSubmit(): void {
    // Validate
    if (!this.username.trim() || !this.email.trim() || !this.password.trim() ||
      !this.firstName.trim() || !this.lastName.trim()) {
      this.errorMessage.set('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage.set('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    // Password length validation
    if (this.password.length < 6) {
      this.errorMessage.set('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    // Password match validation
    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('كلمات المرور غير متطابقة');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const registerRequest: UserRegistrationRequestDto = {
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password,
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim()
    };

    this.authService.register(registerRequest).subscribe({
      next: (user) => {
        this.loading.set(false);
        this.successMessage.set('تم التسجيل بنجاح! جاري تسجيل الدخول...');

        // Auto-login after successful registration
        setTimeout(() => {
          this.authService.login({
            username: this.username.trim(),
            password: this.password
          }).subscribe({
            next: () => {
              this.closeModal();
              this.router.navigate(['/profile']);
            },
            error: (err) => {
              console.error('Auto-login failed:', err);
              this.successMessage.set('تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.');
              setTimeout(() => {
                this.switchToLogin();
              }, 2000);
            }
          });
        }, 1000);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Registration failed:', err);

        if (err.status === 409) {
          this.errorMessage.set('اسم المستخدم أو البريد الإلكتروني مستخدم بالفعل');
        } else if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
        }
      }
    });
  }

  private resetForm(): void {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.firstName = '';
    this.lastName = '';
    this.errorMessage.set('');
    this.successMessage.set('');
    this.loading.set(false);
  }

  // Prevent modal close when clicking inside the modal content
  onModalContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
