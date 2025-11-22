import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { RegisterModal } from './components/register-modal/register-modal';
import { LoginModal } from './components/login-modal/login-modal';
import { Footer } from './components/footer/footer';
import { PlaybackControls } from './components/playback-controls/playback-controls';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    RegisterModal,
    LoginModal,
    Footer,
    PlaybackControls,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ArabicNewsPodcast-FE');
}
