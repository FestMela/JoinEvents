import { Component, signal, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { MockApiService } from '../../core/services/mock-api.service';
import { Vendor } from '../../core/models/vendor.model';

@Component({ selector: 'app-admin-verifications', standalone: true, imports: [FormsModule, TitleCasePipe], templateUrl: './admin-verifications.html', styleUrl: './admin-verifications.css' })
export class AdminVerifications implements OnInit {
  private api = inject(MockApiService);
  vendors = signal<Vendor[]>([]);
  selectedVendor = signal<Vendor | null>(null);
  remarks = '';
  actionDone = signal<string | null>(null);

  ngOnInit() { this.api.getVendors().subscribe(v => { this.vendors.set(v.filter(x => x.verificationStatus !== 'verified' || x.verificationDocs.length > 0)); this.selectVendor(this.vendors()[0]); }); }

  selectVendor(v: Vendor) { this.selectedVendor.set(v); this.remarks = ''; this.actionDone.set(null); }

  approve(id: string) {
    this.vendors.update(vs => vs.map(v => v.id === id ? { ...v, verificationStatus: 'verified' } : v));
    this.actionDone.set('approved');
    if (this.selectedVendor()?.id === id) this.selectedVendor.update(v => v ? { ...v, verificationStatus: 'verified' } : v);
  }

  reject(id: string) {
    this.vendors.update(vs => vs.map(v => v.id === id ? { ...v, verificationStatus: 'rejected' } : v));
    this.actionDone.set('rejected');
    if (this.selectedVendor()?.id === id) this.selectedVendor.update(v => v ? { ...v, verificationStatus: 'rejected' } : v);
  }

  statusColor(s: string): string { const m: Record<string,string> = { verified:'ee-badge-success', under_review:'ee-badge-warning', pending:'ee-badge-info', rejected:'ee-badge-danger' }; return m[s] || 'ee-badge-primary'; }
  statusLabel(s: string): string { const m: Record<string,string> = { verified:'Verified', under_review:'Under Review', pending:'Pending', rejected:'Rejected' }; return m[s] || s; }
}
