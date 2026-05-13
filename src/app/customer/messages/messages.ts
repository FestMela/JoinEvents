import { Component, signal, OnInit, inject, ViewChild, ElementRef, AfterViewChecked, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessengerService } from '../../core/services/messenger.service';
import { AuthService } from '../../core/services/auth.service';
import { ChatThread, ChatMessage } from '../../core/models/message.model';
import { CommonModule } from '@angular/common';
import { timer, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-customer-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class CustomerMessages implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  private messenger = inject(MessengerService);
  private auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  threads = signal<ChatThread[]>([]);
  messages = signal<ChatMessage[]>([]);
  selectedThread = signal<ChatThread | null>(null);
  newMessage = '';
  user = this.auth.currentUser;

  ngOnInit() {
    const userId = this.user()?.id || 'c1';
    this.messenger.getChatThreads(userId).subscribe(t => { 
      this.threads.set(t); 
      if (t.length && window.innerWidth > 768) {
        this.openThread(t[0]); 
      }
    });

    // Background polling for live updates every 3 seconds
    timer(3000, 3000).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(() => {
        const active = this.selectedThread();
        return active ? this.messenger.getChatMessages(active.id).pipe(catchError(() => of([]))) : of([]);
      })
    ).subscribe(newMsgs => {
      if (newMsgs.length && newMsgs.length !== this.messages().length) {
        this.messages.set(newMsgs);
        setTimeout(() => this.scrollToBottom(), 50);
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  openThread(t: ChatThread) {
    this.selectedThread.set(t);
    this.messenger.getChatMessages(t.id).subscribe({
      next: (m) => {
        this.messages.set(m);
        this.messenger.markAsRead(t.id).subscribe();
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: () => {
        this.messages.set([]);
      }
    });
  }

  closeThread() {
    this.selectedThread.set(null);
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    
    const thread = this.selectedThread();
    const currentUser = this.user();
    if (!thread || !currentUser) return;

    const msgPayload: Partial<ChatMessage> = { 
      threadId: thread.id, 
      senderId: currentUser.id, 
      senderName: currentUser.name, 
      senderRole: 'customer', 
      content: this.newMessage, 
      timestamp: new Date().toISOString(), 
      isRead: false, 
      type: 'text' 
    };

    // Optimistic UI Update: Add a temporary message immediately
    const tempId = 'temp-' + Date.now();
    const optimisticMsg: ChatMessage = { ...msgPayload, id: tempId } as ChatMessage;
    
    this.messages.update(m => [...m, optimisticMsg]);
    this.newMessage = '';
    
    // API Call
    this.messenger.sendMessage(msgPayload).subscribe({
      next: (savedMsg) => {
        // Replace temp message with the real one from server
        this.messages.update(m => m.map(item => item.id === tempId ? savedMsg : item));
        setTimeout(() => this.scrollToBottom(), 50);
      },
      error: () => {
        // Rollback on error
        this.messages.update(m => m.filter(item => item.id !== tempId));
      }
    });
  }

  formatTime(ts: string): string {
    return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  isSent(msg: ChatMessage): boolean { 
    return msg.senderRole === 'customer'; 
  }
}
