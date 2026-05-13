import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { API_ROUTES } from '../constants/api.constants';
import { ChatThread, ChatMessage } from '../models/message.model';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MessengerService extends BaseApiService {

  getChatThreads(userId: string): Observable<ChatThread[]> {
    return this.get<any[]>(API_ROUTES.MESSENGER.THREADS).pipe(
      map(threads => threads.map(t => ({
        id: t.ThreadId,
        subject: t.RecipientName,
        lastMessage: t.LastMessage,
        lastMessageTime: t.UpdatedAt,
        unreadCount: t.UnreadCount,
        participants: [
          { id: userId, name: 'Me', role: 'customer' },
          { id: t.RecipientId, name: t.RecipientName, role: 'vendor' }
        ]
      } as ChatThread)))
    );
  }

  getChatMessages(threadId: string): Observable<ChatMessage[]> {
    return this.get<any[]>(API_ROUTES.MESSENGER.MESSAGES(threadId)).pipe(
      map(msgs => msgs.map(m => ({
        id: m.MessageId,
        threadId: m.ThreadId,
        senderId: m.SenderId,
        content: m.Content,
        timestamp: m.Timestamp,
        senderRole: m.SenderId.startsWith('v') ? 'vendor' : (m.SenderId.startsWith('a') ? 'admin' : 'customer'),
        isRead: true,
        type: 'text'
      } as ChatMessage))),
      catchError(error => {
        if (error.status === 404) {
          return of([]); // Return empty messages if thread not found or empty
        }
        return throwError(() => error);
      })
    );
  }

  sendMessage(msg: Partial<ChatMessage>): Observable<ChatMessage> {
    return this.post<any>(API_ROUTES.MESSENGER.MESSAGES(msg.threadId!), {
      Content: msg.content
    }).pipe(
      map(m => ({
        id: m.MessageId,
        threadId: m.ThreadId,
        senderId: m.SenderId,
        content: m.Content,
        timestamp: m.Timestamp,
        senderRole: 'customer',
        isRead: true,
        type: 'text'
      } as ChatMessage))
    );
  }

  markAsRead(threadId: string): Observable<boolean> {
    return of(true);
  }

  isThreadAlive(threadId: string): Observable<boolean> {
    return this.get<any>(API_ROUTES.MESSENGER.ALIVE(threadId)).pipe(
      map(res => res.isAlive)
    );
  }
}
