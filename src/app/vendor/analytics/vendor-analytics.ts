import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnalyticsService, VendorAnalyticsData } from '../../core/services/analytics.service';

@Component({
  selector: 'app-vendor-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalPipe, TitleCasePipe],
  templateUrl: './vendor-analytics.html',
  styleUrl: './vendor-analytics.css'
})
export class VendorAnalytics implements OnInit {
  private analyticsService = inject(AnalyticsService);

  loading = signal(true);
  error = signal<string | null>(null);
  data = signal<VendorAnalyticsData | null>(null);

  readonly monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  maxEarnings = computed(() => {
    const d = this.data();
    if (!d) return 1;
    return Math.max(...d.monthlyEarnings, 1);
  });

  statusList = computed(() => {
    const d = this.data();
    if (!d) return [];
    return Object.entries(d.bookingCountByStatus).map(([status, count]) => ({
      status,
      count
    }));
  });

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading.set(true);
    this.error.set(null);
    this.analyticsService.getVendorAnalytics('v1').subscribe({
      next: (res) => {
        this.data.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load vendor analytics.');
        this.loading.set(false);
      }
    });
  }
}
