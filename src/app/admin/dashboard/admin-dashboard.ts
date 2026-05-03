import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockApiService } from '../../core/services/mock-api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-admin-dashboard', standalone: true, imports: [RouterLink], templateUrl: './admin-dashboard.html', styleUrl: './admin-dashboard.css' })
export class AdminDashboard implements OnInit {
  private api = inject(MockApiService);
  private auth = inject(AuthService);
  kpis = signal<any>(null);

  isAdmin = computed(() => this.auth.getRole() === 'admin');

  readonly kpiDefs = [
    { key: 'totalRevenue', label: 'Platform Revenue', icon: 'bi-wallet2', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', textColor: '#ffffff', adminOnly: true },
    { key: 'activeEvents', label: 'Running Events', icon: 'bi-stars', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', textColor: '#ffffff', adminOnly: false },
    { key: 'totalCustomers', label: 'Total Clients', icon: 'bi-person-heart', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', textColor: '#ffffff', adminOnly: false },
    { key: 'totalVendors', label: 'Service Partners', icon: 'bi-patch-check', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', textColor: '#ffffff', adminOnly: false },
  ];

  get filteredKpis() {
    return this.kpiDefs.filter(k => !k.adminOnly || this.isAdmin());
  }

  ngOnInit() { this.api.getAdminKPIs().subscribe(k => this.kpis.set(k)); }

  formatKpi(key: string): string {
    const k = this.kpis();
    if (!k) return '-';
    const v = k[key];
    if (key === 'totalRevenue') return '₹' + (v / 100000).toFixed(1) + 'L';
    return String(v);
  }

  getBarWidth(idx: number): string {
    const months = this.kpis()?.monthlyRevenue || [];
    const max = Math.max(...months);
    return months[idx] ? `${(months[idx] / max) * 100}%` : '0%';
  }
}
