import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
  private showLoginModal = new BehaviorSubject<boolean>(false);
  private showRegisterModal = new BehaviorSubject<boolean>(false);

  public showLoginModal$ = this.showLoginModal.asObservable();
  public showRegisterModal$ = this.showRegisterModal.asObservable();

  openLogin(): void {
    this.showRegisterModal.next(false); // Close register if open
    this.showLoginModal.next(true);
  }

  closeLogin(): void {
    this.showLoginModal.next(false);
  }

  openRegister(): void {
    this.showLoginModal.next(false); // Close login if open
    this.showRegisterModal.next(true);
  }

  closeRegister(): void {
    this.showRegisterModal.next(false);
  }

  closeAll(): void {
    this.showLoginModal.next(false);
    this.showRegisterModal.next(false);
  }
}
