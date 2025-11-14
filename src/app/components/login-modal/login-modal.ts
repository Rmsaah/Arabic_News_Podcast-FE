import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthModalService } from '../../services/auth-modal.service';
import { AuthService } from '../../services/auth.service';
import { LoginRequestDto } from '../../models/episode.model';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.css'
})
export class LoginModal {
  isVisible = signal<boolean>(false);
  username = '';
  password = '';
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(
    private authModalService: AuthModalService,
    private authService: AuthService,
    private router: Router
  ) {
    // Subscribe to modal visibility
    this.authModalService.showLoginModal$.subscribe(show => {
      this.isVisible.set(show);
      if (show) {
        // Reset form when opened
        this.resetForm();
      }
    });
  }

  closeModal(): void {
    this.authModalService.closeLogin();
  }

  switchToRegister(): void {
    this.authModalService.openRegister();
  }

  onSubmit(): void {
    // Validate
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage.set('يرجى ملء جميع الحقول');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const loginRequest: LoginRequestDto = {
      username: this.username.trim(),
      password: this.password
    };

    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.closeModal();
        // Redirect to profile or home
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Login failed:', err);
        if (err.status === 401) {
          this.errorMessage.set('اسم المستخدم أو كلمة المرور غير صحيحة');
        } else {
          this.errorMessage.set('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
        }
      }
    });
  }

  private resetForm(): void {
    this.username = '';
    this.password = '';
    this.errorMessage.set('');
    this.loading.set(false);
  }

  // Prevent modal close when clicking inside the modal content
  onModalContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
