import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private router = inject(Router);
  step = signal(1);
  role = signal<UserRole>('customer');
  isLoading = false;

  form = { name: '', email: '', phone: '', password: '', confirmPassword: '', businessName: '', city: '', agreeTerms: false };

  selectRole(r: UserRole) { this.role.set(r); }
  nextStep() { this.step.update(s => s + 1); }
  prevStep() { this.step.update(s => s - 1); }

  onSubmit() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/login']);
    }, 1200);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    if (img.nextElementSibling) {
      (img.nextElementSibling as HTMLElement).style.display = 'block';
    }
  }
}
