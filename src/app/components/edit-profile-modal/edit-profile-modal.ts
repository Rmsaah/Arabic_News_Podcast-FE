import { Component, Input, Output, EventEmitter, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile-modal.html',
  styleUrl: './edit-profile-modal.css'
})
export class EditProfileModal implements OnChanges {
  @Input() isVisible: boolean = false;
  @Input() userId: string = '';
  @Input() currentFirstName: string = '';
  @Input() currentLastName: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() profileUpdated = new EventEmitter<void>();

  firstName = '';
  lastName = '';
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Update form values when inputs change and modal becomes visible
    if (changes['isVisible'] && this.isVisible) {
      this.firstName = this.currentFirstName;
      this.lastName = this.currentLastName;
      this.errorMessage.set('');
      this.successMessage.set('');
      this.loading.set(false);
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  onSubmit(): void {
    // Trim whitespace
    const trimmedFirstName = this.firstName.trim();
    const trimmedLastName = this.lastName.trim();

    // Validate - at least one field must be provided and different
    if (!trimmedFirstName && !trimmedLastName) {
      this.errorMessage.set('يرجى إدخال اسم واحد على الأقل');
      return;
    }

    // Check if anything actually changed
    if (trimmedFirstName === this.currentFirstName && trimmedLastName === this.currentLastName) {
      this.errorMessage.set('لم يتم تغيير أي شيء');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Call API - backend accepts undefined for unchanged fields
    this.userService.updateUserName(
      this.userId,
      trimmedFirstName || undefined,
      trimmedLastName || undefined
    ).subscribe({
      next: (updatedUser) => {
        this.loading.set(false);
        this.successMessage.set('تم تحديث الملف الشخصي بنجاح!');

        // Wait briefly to show success message, then close and refresh
        setTimeout(() => {
          this.profileUpdated.emit();
          this.closeModal();
        }, 1500);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Failed to update profile:', err);

        if (err.status === 403) {
          this.errorMessage.set('ليس لديك صلاحية لتعديل هذا الملف الشخصي');
        } else if (err.error?.message) {
          this.errorMessage.set(err.error.message);
        } else {
          this.errorMessage.set('حدث خطأ أثناء التحديث. يرجى المحاولة مرة أخرى.');
        }
      }
    });
  }

  // Prevent modal close when clicking inside the modal content
  onModalContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
