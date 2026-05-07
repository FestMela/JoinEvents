import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockApiService } from '../../core/services/mock-api.service';
import { ToastService } from '../../core/services/toast.service';
import { SupportTicket } from '../../core/models/message.model';

@Component({
  selector: 'app-customer-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.html',
  styleUrl: './support.css'
})
export class CustomerSupport implements OnInit {
  private api = inject(MockApiService);
  private toast = inject(ToastService);

  tickets = signal<SupportTicket[]>([]);
  selectedTicket = signal<SupportTicket | null>(null);

  // New Ticket Form State
  showCreateModal = signal(false);
  newSubject = '';
  newPriority = 'medium';
  submitting = signal(false);
  selectedFileName = signal<string | null>(null);

  // Filter and search
  searchQuery = signal('');
  activeTab = signal<'all' | 'open' | 'resolved'>('all');

  customerTickets = computed(() => {
    // Only show tickets for Rajesh Kumar (customerId: 'c1')
    return this.tickets().filter(t => t.customerId === 'c1');
  });

  filteredTickets = computed(() => {
    let list = this.customerTickets();
    const query = this.searchQuery().toLowerCase();
    const tab = this.activeTab();

    if (query) {
      list = list.filter(t => t.subject.toLowerCase().includes(query));
    }
    if (tab === 'open') {
      list = list.filter(t => t.status === 'open' || t.status === 'in_progress');
    } else if (tab === 'resolved') {
      list = list.filter(t => t.status === 'resolved' || t.status === 'closed');
    }
    return list;
  });

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.api.getSupportTickets().subscribe(t => {
      this.tickets.set(t);
      if (t.length && !this.selectedTicket()) {
        const firstCustTicket = t.find(ticket => ticket.customerId === 'c1');
        if (firstCustTicket) this.selectedTicket.set(firstCustTicket);
      }
    });
  }

  selectTicket(t: SupportTicket) {
    this.selectedTicket.set(t);
  }

  openCreateModal() {
    this.newSubject = '';
    this.newPriority = 'medium';
    this.selectedFileName.set(null);
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName.set(input.files[0].name);
    }
  }

  removeSelectedFile(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedFileName.set(null);
    const input = document.getElementById('ticketFile') as HTMLInputElement;
    if (input) input.value = '';
  }

  submitTicket() {
    if (!this.newSubject.trim()) {
      this.toast.error('Please enter a valid issue description.');
      return;
    }

    this.submitting.set(true);
    this.api.createSupportTicket(this.newSubject.trim(), this.newPriority).subscribe(ticket => {
      this.submitting.set(false);
      this.closeCreateModal();
      this.toast.success('Your support issue has been raised successfully! An officer will assign soon.');
      this.loadTickets();
      this.selectedTicket.set(ticket);
    });
  }

  priorityColor(p: string): string {
    const map: Record<string, string> = { low: 'bg-info', medium: 'bg-warning text-dark', high: 'bg-danger text-white', urgent: 'bg-dark text-white' };
    return map[p] || 'bg-secondary';
  }

  statusColor(s: string): string {
    const map: Record<string, string> = { open: 'bg-danger text-white', in_progress: 'bg-warning text-dark', resolved: 'bg-success text-white', closed: 'bg-secondary text-white' };
    return map[s] || 'bg-primary';
  }
}
