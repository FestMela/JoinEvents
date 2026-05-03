import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  email = '';
  isSubmitted = signal(false);
  isLoading = signal(false);

  onSubmit() {
    if (!this.email) return;
    
    this.isLoading.set(true);
    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.isSubmitted.set(true);
    }, 1500);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    if (img.nextElementSibling) {
      (img.nextElementSibling as HTMLElement).style.display = 'block';
    }
  }
}
