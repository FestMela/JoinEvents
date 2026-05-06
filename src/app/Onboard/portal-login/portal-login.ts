import { Component, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-portal-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './portal-login.html',
  styleUrl: './portal-login.css'
})
export class PortalLogin implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  selectedRole = signal<UserRole>('vendor');
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  errorMsg = '';
  returnUrl = '';

  readonly roles: { role: UserRole; label: string; icon: string; color: string }[] = [
    { role: 'vendor',   label: 'Vendor',   icon: 'bi-shop',         color: '#6B21A8' },
    { role: 'admin',    label: 'Admin',    icon: 'bi-shield-check',  color: '#0EA5E9' },
    { role: 'support',  label: 'Support',  icon: 'bi-headset',       color: '#F59E0B' },
  ];

  readonly demoCredentials: Record<UserRole, string> = {
    customer: 'customer@demo.com', // keep just for TS type completeness if needed
    vendor: 'vendor@demo.com',
    admin: 'admin@demo.com',
    support: 'support@demo.com',
  };

  selectRole(role: UserRole) {
    this.selectedRole.set(role);
    this.email = this.demoCredentials[role];
    this.password = 'JoinEvents@2025';
    this.errorMsg = '';
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
    // Init demo creds for default vendor role
    this.email = this.demoCredentials['vendor'];
    this.password = 'JoinEvents@2025';
  }

  onSubmit() {
    if (!this.email || !this.password) { this.errorMsg = 'Please fill all fields.'; return; }
    this.isLoading = true;
    this.errorMsg = '';
    setTimeout(() => {
      const result = this.auth.login(this.email, this.password, this.selectedRole(), this.returnUrl);
      if (!result.success) { this.errorMsg = result.message; }
      this.isLoading = false;
    }, 800);
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    if (img.nextElementSibling) {
      (img.nextElementSibling as HTMLElement).style.display = 'block';
    }
  }
}
