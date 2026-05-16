import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService, AdminAnalyticsData } from '../../core/services/analytics.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './admin-analytics.html',
  styleUrl: './admin-analytics.css'
})
export class AdminAnalytics implements OnInit {
  private analyticsService = inject(AnalyticsService);

  loading = signal(true);
  error = signal<string | null>(null);
  data = signal<AdminAnalyticsData | null>(null);

  // Date filters
  startDateVal = signal('');
  endDateVal = signal('');
  dateValidationError = signal<string | null>(null);

  readonly monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  maxRevenue = computed(() => {
    const d = this.data();
    if (!d) return 1;
    return Math.max(...d.monthlyRevenue, 1);
  });

  maxAcquisition = computed(() => {
    const d = this.data();
    if (!d) return 1;
    return Math.max(...d.customerAcquisitionByMonth, 1);
  });

  bookingStatusArray = computed(() => {
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
    this.analyticsService.getAdminAnalytics().subscribe({
      next: (res) => {
        this.data.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load analytics data. Please try again.');
        this.loading.set(false);
      }
    });
  }

  applyDateFilter() {
    const start = this.startDateVal();
    const end = this.endDateVal();

    if (start && end && start > end) {
      this.dateValidationError.set('Start date cannot be after end date.');
      return;
    }

    this.dateValidationError.set(null);
    this.loadAnalytics(); // Reload to simulate scoped API fetch
  }

  getPercentageChange(current: number, preceding: number): string {
    if (preceding === 0) return 'N/A';
    const pct = ((current - preceding) / preceding) * 100;
    return (pct >= 0 ? '+' : '') + pct.toFixed(1) + '%';
  }
}
