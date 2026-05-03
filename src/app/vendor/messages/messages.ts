import { Component, signal, OnInit, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockApiService } from '../../core/services/mock-api.service';
import { AuthService } from '../../core/services/auth.service';
import { ChatThread, ChatMessage } from '../../core/models/message.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendor-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class VendorMessages implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  private api = inject(MockApiService);
  private auth = inject(AuthService);
  threads = signal<ChatThread[]>([]);
  messages = signal<ChatMessage[]>([]);
  selectedThread = signal<ChatThread | null>(null);
  newMessage = '';
  user = this.auth.currentUser;

  ngOnInit() {
    this.api.getChatThreads('v1').subscribe(t => { 
      this.threads.set(t); 
      if (t.length && window.innerWidth > 768) {
        this.openThread(t[0]); 
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
    this.api.getChatMessages(t.id).subscribe(m => {
      this.messages.set(m);
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  closeThread() {
    this.selectedThread.set(null);
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    const msg: ChatMessage = { 
      id: 'new' + Date.now(), 
      threadId: this.selectedThread()!.id, 
      senderId: 'v1', 
      senderName: this.user()!.name, 
      senderRole: 'vendor', 
      content: this.newMessage, 
      timestamp: new Date().toISOString(), 
      isRead: false, 
      type: 'text' 
    };
    this.messages.update(m => [...m, msg]);
    this.newMessage = '';
    
    setTimeout(() => {
      const reply: ChatMessage = {
        id: 'reply' + Date.now(),
        threadId: msg.threadId,
        senderId: 'c1',
        senderName: 'Rajesh Kumar',
        senderRole: 'customer',
        content: 'That sounds perfect! Please share the final invoice so we can proceed with the advance payment.',
        timestamp: new Date().toISOString(),
        isRead: false,
        type: 'text'
      };
      if (this.selectedThread()?.id === reply.threadId) {
        this.messages.update(m => [...m, reply]);
      }
    }, 2000);
  }

  formatTime(ts: string): string {
    return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  isSent(msg: ChatMessage): boolean { 
    return msg.senderRole === 'vendor'; 
  }
}
