import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaceholderService {

  /**
   * Generate a canvas-based placeholder image with Arabic text support
   */
  generatePlaceholder(
    width: number = 400,
    height: number = 300,
    text: string = 'علوم اليوم',
    bgColor: string = '#667eea',
    textColor: string = '#ffffff'
  ): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Text configuration for Arabic support
    const fontSize = Math.min(width, height) / 10;
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px Arial, Tahoma, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl'; // Right-to-left for Arabic

    // Draw text
    ctx.fillText(text, width / 2, height / 2);

    return canvas.toDataURL('image/png');
  }
}
