import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockApiService } from '../../core/services/mock-api.service';
import { ConfirmService } from '../../shared/components/confirm-dialog';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reviews.html',
  styleUrl: './admin-reviews.css'
})
export class AdminReviews {
  private api = inject(MockApiService);
  private confirm = inject(ConfirmService);
  private auth = inject(AuthService);

  canModerate = computed(() => {
    const role = this.auth.getRole();
    return role === 'admin' || role === 'support';
  });

  activeTab = signal<'pending' | 'history'>('pending');

  flaggedReviews = computed(() => {
    return this.api.globalReviews().filter(r => r.status === 'flagged');
  });

  disputeHistory = computed(() => {
    return this.api.globalReviews().filter(r => r.resolution);
  });

  async resolve(id: string, action: 'keep' | 'remove') {
    const isKeep = action === 'keep';
    const confirmed = await this.confirm.ask({
      title: isKeep ? 'Keep Review' : 'Remove Review',
      message: isKeep 
        ? 'Are you sure you want to dismiss the vendor\'s dispute? The review will remain published.'
        : 'Are you sure you want to remove this review? This action cannot be undone.',
      confirmText: isKeep ? 'Keep Review' : 'Remove Review',
      type: isKeep ? 'primary' : 'danger'
    });

    if (confirmed) {
      this.api.resolveDispute(id, action).subscribe();
    }
  }
}
