import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class HeroComponent {
  projectName = 'سعودي بود! بودكاست الأخبار العربية';
  tagline = 'استمع إلى آخر الأخبار العربية في صيغة بودكاست صوتي';
}
