import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe, SlicePipe } from '@angular/common';
import { MockApiService } from '../../core/services/mock-api.service';
import { SupportTicket } from '../../core/models/message.model';

@Component({ selector: 'app-admin-support', standalone: true, imports: [FormsModule, TitleCasePipe, SlicePipe], templateUrl: './admin-support.html', styleUrl: './admin-support.css' })
export class AdminSupport implements OnInit {
  // REBUILD TRIGGER: 1777721313
  private api = inject(MockApiService);
  tickets = signal<SupportTicket[]>([]);
  selected = signal<SupportTicket | null>(null);
  reply = '';

  // Filters
  searchQuery = signal('');
  statusFilter = signal('all');
  priorityFilter = signal('all');

  filteredTickets = computed(() => {
    let ts = this.tickets();
    const query = this.searchQuery().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();

    if (query) {
      ts = ts.filter(t => t.subject.toLowerCase().includes(query) || t.customerName.toLowerCase().includes(query));
    }
    if (status !== 'all') {
      ts = ts.filter(t => t.status === status);
    }
    if (priority !== 'all') {
      ts = ts.filter(t => t.priority === priority);
    }
    return ts;
  });

  ngOnInit() { 
    this.api.getSupportTickets().subscribe(t => { 
      this.tickets.set(t); 
      if (t.length) this.selected.set(t[0]); 
    }); 
  }

  selectTicket(t: SupportTicket) { this.selected.set(t); }
  
  closeTicket(id: string) { 
    this.tickets.update(ts => ts.map(t => t.id === id ? { ...t, status: 'resolved' as any } : t)); 
    if (this.selected()?.id === id) {
      this.selected.update(t => t ? { ...t, status: 'resolved' as any } : t);
    }
  }

  sendReply() { if (!this.reply.trim()) return; this.reply = ''; }

  priorityColor(p: string): string { const m: Record<string,string> = { low:'ee-badge-info', medium:'ee-badge-warning', high:'ee-badge-primary', urgent:'ee-badge-danger' }; return m[p] || 'ee-badge-info'; }
  statusColor(s: string): string { const m: Record<string,string> = { open:'ee-badge-danger', in_progress:'ee-badge-warning', resolved:'ee-badge-success', closed:'ee-badge-secondary' }; return m[s] || 'ee-badge-primary'; }
}
