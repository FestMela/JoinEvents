import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-support-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="support-welcome-banner">
      <div>
        <div style="color:inherit;font-family:var(--font-heading);font-size:1.5rem;font-weight:800;letter-spacing:-0.5px;">Support Hub 🎧</div>
        <div style="color:inherit;opacity:0.85;font-size:0.9rem;margin-top:6px;max-width:500px;">You're doing great! There are <span style="font-weight:700">8 open tickets</span> and <span style="font-weight:700">14 active chats</span> currently in queue.</div>
      </div>
      <div class="d-flex gap-2">
        <a routerLink="/support/tickets" class="btn-support-action">
          <i class="bi bi-headset"></i> View Helpdesk
        </a>
      </div>
    </div>

    <!-- Support KPIs -->
    <div class="row g-3 mb-4">
      @for (kpi of supportKpis; track kpi.label) {
        <div class="col-6 col-md-3">
          <div class="premium-stat-card">
            <div class="stat-inner">
              <div class="stat-details">
                <div class="stat-label">{{ kpi.label }}</div>
                <div class="stat-value">{{ kpi.value }}</div>
              </div>
              <div class="stat-icon-box" [style.background]="kpi.gradient">
                <i class="bi {{ kpi.icon }}"></i>
              </div>
            </div>
            <div class="stat-progress-bar">
              <div class="progress-fill" [style.background]="kpi.gradient" style="width: 70%"></div>
            </div>
          </div>
        </div>
      }
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-8">
        <div class="ee-card p-4">
          <h6 class="chart-title"><i class="bi bi-clock-history me-2 text-warning"></i>Ticket Response Times (Last 24h)</h6>
          <div class="ticket-chart-container">
            @for (h of [2, 4, 8, 10, 12, 14, 16, 18, 20, 22]; track h) {
              <div class="bar-group">
                <div class="bar-wrap">
                  <div class="ticket-bar" [style.height]="(h * 4) + '%'" style="background: linear-gradient(to top, #F59E0B, #D97706)"></div>
                </div>
                <div class="bar-label">{{ h }}h</div>
              </div>
            }
          </div>
        </div>
      </div>
      <div class="col-12 col-lg-4">
        <div class="ee-card p-4">
          <h6 class="chart-title"><i class="bi bi-lightning-charge me-2 text-warning"></i>Priority Distribution</h6>
          <div class="quick-stats-list">
            <div class="qs-item">
              <span class="qs-label"><span class="status-dot bg-danger"></span>Critical / Urgent</span>
              <span class="qs-val">2</span>
            </div>
            <div class="qs-item">
              <span class="qs-label"><span class="status-dot bg-warning"></span>High Priority</span>
              <span class="qs-val">5</span>
            </div>
            <div class="qs-item">
              <span class="qs-label"><span class="status-dot bg-info"></span>Medium / Low</span>
              <span class="qs-val">12</span>
            </div>
            <div class="qs-item border-top mt-2 pt-3">
              <span class="qs-label">Avg Resolution Time</span>
              <span class="qs-val">4.2h</span>
            </div>
            <div class="qs-item">
              <span class="qs-label">Satisfaction Score</span>
              <span class="qs-val text-accent">4.8 ★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './support-dashboard.css'
})
export class SupportDashboard {
  private auth = inject(AuthService);
  user = this.auth.currentUser;

  readonly supportKpis = [
    { label: 'Open Tickets', value: '8', icon: 'bi-headset', gradient: 'linear-gradient(135deg,#F59E0B,#D97706)' },
    { label: 'Active Chats', value: '14', icon: 'bi-chat-dots', gradient: 'linear-gradient(135deg,#0EA5E9,#2563EB)' },
    { label: 'Pending Reviews', value: '1', icon: 'bi-flag', gradient: 'linear-gradient(135deg,#EF4444,#B91C1C)' },
    { label: 'Today Resolves', value: '23', icon: 'bi-check2-circle', gradient: 'linear-gradient(135deg,#10B981,#059669)' },
  ];
}
