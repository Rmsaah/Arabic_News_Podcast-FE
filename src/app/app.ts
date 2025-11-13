import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import {LoginModalComponent} from './components/login-modal/login-modal';
import {RegisterModalComponent} from './components/register-modal/register-modal';
import {FooterComponent} from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LoginModalComponent,
    RegisterModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ArabicNewsPodcast-FE');
}
