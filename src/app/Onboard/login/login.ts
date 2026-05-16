import { Component, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  returnUrl = '';
  rememberMe = false;

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    const rememberedEmail = localStorage.getItem('joinevents_remember_email');
    const isRemembered = localStorage.getItem('joinevents_remember_me') === 'true';
    if (isRemembered && rememberedEmail) {
      this.email = rememberedEmail;
      this.rememberMe = true;
    } else {
      this.email = '';
    }
    this.password = '';
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.toast.error('Please fill all fields.');
      return;
    }
    this.isLoading = true;
    this.auth.login(this.email, this.password, 'customer', this.returnUrl).subscribe({
      next: (result) => {
        if (!result.success) {
          this.toast.error(result.message);
        } else {
          this.toast.success('Login successful!');
          if (this.rememberMe) {
            localStorage.setItem('joinevents_remember_email', this.email);
            localStorage.setItem('joinevents_remember_me', 'true');
          } else {
            localStorage.removeItem('joinevents_remember_email');
            localStorage.removeItem('joinevents_remember_me');
          }
        }
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('An error occurred during login.');
        this.isLoading = false;
      }
    });
  }

  loginWithSocial(provider: string) {
    this.toast.warning(`${provider} login is currently unavailable. Please sign in with your email and password.`);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    if (img.nextElementSibling) {
      (img.nextElementSibling as HTMLElement).style.display = 'block';
    }
  }
}
