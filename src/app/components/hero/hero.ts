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
export class Hero {
  projectName = 'علوم اليوم! بودكاست الأخبار العربية';
  tagline = 'استمع إلى آخر الأخبار العربية في صيغة بودكاست صوتي';
}
