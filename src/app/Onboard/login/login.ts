import { Component, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  errorMsg = '';
  returnUrl = '';

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    this.email = 'customer@demo.com';
    this.password = 'JoinEvents@2025';
  }

  onSubmit() {
    if (!this.email || !this.password) { this.errorMsg = 'Please fill all fields.'; return; }
    this.isLoading = true;
    this.errorMsg = '';
    setTimeout(() => {
      const result = this.auth.login(this.email, this.password, 'customer', this.returnUrl);
      if (!result.success) { this.errorMsg = result.message; }
      this.isLoading = false;
    }, 800);
  }

  loginWithSocial(provider: string) {
    this.isLoading = true;
    this.errorMsg = '';
    setTimeout(() => {
      const result = this.auth.login('customer@demo.com', 'JoinEvents@2025', 'customer', this.returnUrl);
      if (!result.success) { this.errorMsg = result.message; }
      this.isLoading = false;
    }, 1000);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    if (img.nextElementSibling) {
      (img.nextElementSibling as HTMLElement).style.display = 'block';
    }
  }
}
