import { Component, signal, computed, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { MockApiService } from '../../core/services/mock-api.service';
import { Vendor } from '../../core/models/vendor.model';
import { ConfirmService } from '../../shared/components/confirm-dialog';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-admin-vendors', standalone: true, imports: [TitleCasePipe], templateUrl: './admin-vendors.html', styleUrl: './admin-vendors.css' })
export class AdminVendors {
  private api = inject(MockApiService);
  private confirm = inject(ConfirmService);
  private auth = inject(AuthService);
  
  isAdmin = computed(() => this.auth.getRole() === 'admin');
  vendors = this.api.globalVendors;
  
  searchQuery = signal('');
  statusFilter = signal('all');

  filteredVendors = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.statusFilter();
    
    return this.vendors().filter(v => {
      const matchesSearch = !query || 
        v.businessName.toLowerCase().includes(query) || 
        v.name.toLowerCase().includes(query) || 
        v.email.toLowerCase().includes(query);
        
      const matchesFilter = filter === 'all' || 
        (filter === 'suspended' && v.accountStatus === 'suspended') ||
        (filter === 'banned' && v.accountStatus === 'banned') ||
        (filter === 'active' && v.accountStatus === 'active') ||
        (filter === v.verificationStatus);
        
      return matchesSearch && matchesFilter;
    });
  });

  suspendingVendor = signal<Vendor | null>(null);
  suspendReason = signal('');
  suspendDuration = signal('1_week');

  openSuspendForm(vendor: Vendor) {
    this.suspendingVendor.set(vendor);
    this.suspendReason.set('');
    this.suspendDuration.set('1_week');
  }

  cancelSuspend() {
    this.suspendingVendor.set(null);
  }

  confirmSuspend() {
    const v = this.suspendingVendor();
    if (v && this.suspendReason().trim()) {
      this.api.moderateVendor(v.id, 'suspend', this.suspendReason(), this.suspendDuration()).subscribe(() => {
        this.suspendingVendor.set(null);
      });
    }
  }

  async banVendor(vendorId: string, name: string) {
    const confirmed = await this.confirm.ask({
      title: 'Ban Vendor',
      message: `Are you sure you want to permanently BAN ${name}? This action is severe and cannot be easily undone.`,
      confirmText: 'Ban Vendor',
      type: 'danger'
    });
    if (confirmed) {
      this.api.moderateVendor(vendorId, 'ban').subscribe();
    }
  }

  async reactivateVendor(vendorId: string, name: string) {
    const confirmed = await this.confirm.ask({
      title: 'Reactivate Vendor',
      message: `Are you sure you want to restore active status for ${name}?`,
      confirmText: 'Reactivate',
      type: 'primary'
    });
    if (confirmed) {
      this.api.moderateVendor(vendorId, 'reactivate').subscribe();
    }
  }

  statusColor(s: string): string { const m: Record<string,string> = { verified:'ee-badge-success', under_review:'ee-badge-warning', pending:'ee-badge-info', rejected:'ee-badge-danger' }; return m[s] || 'ee-badge-primary'; }
  statusLabel(s: string): string { const m: Record<string,string> = { verified:'Verified', under_review:'Under Review', pending:'Pending', rejected:'Rejected' }; return m[s] || s; }
}
