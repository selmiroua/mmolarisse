import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderProfilePicture: string;
  recipientId: number;
  recipientName: string;
  recipientProfilePicture: string;
  content: string;
  sentAt: Date;
  readAt: Date | null;
  isRead: boolean;
  isMine: boolean;
}

export interface Conversation {
  partnerId: number;
  partnerName: string;
  partnerRole: string;
  profilePicture: string;
  lastMessageContent: string;
  lastMessageTime: Date;
  isLastMessageMine: boolean;
  unreadCount: number;
}

export interface SendMessageRequest {
  recipientId: number;
  content: string;
}

export interface PagedResponse {
  content: Message[];
  totalElements: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private apiUrl = `${environment.apiUrl}/api/v1/api/messages`;
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUnreadMessageCount();
  }

  // Get all conversations for the current user
  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`).pipe(
      map(conversations => {
        // Convert string dates to Date objects
        return conversations.map(conv => ({
          ...conv,
          lastMessageTime: new Date(conv.lastMessageTime)
        }));
      }),
      catchError(error => {
        console.error('Error fetching conversations:', error);
        return of([]);
      })
    );
  }

  // Get conversation with another user
  getConversation(userId: number): Observable<Message[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conversations/${userId}`).pipe(
      map(messages => {
        // Convert string dates to Date objects and ensure correct typing
        return messages.map(msg => ({
          ...msg,
          sentAt: new Date(msg.sentAt),
          readAt: msg.readAt ? new Date(msg.readAt) : null
        } as Message));
      }),
      tap(() => {
        // Update unread count after viewing a conversation
        this.loadUnreadMessageCount();
      }),
      catchError(error => {
        console.error(`Error fetching conversation with user ${userId}:`, error);
        return of([]);
      })
    );
  }

  // Get paginated conversation
  getConversationPaged(userId: number, page: number = 0, size: number = 20): Observable<PagedResponse> {
    return this.http.get<any>(
      `${this.apiUrl}/conversations/${userId}/paged?page=${page}&size=${size}`
    ).pipe(
      map(response => {
        // Convert string dates to Date objects in the content array
        if (response.content) {
          response.content = response.content.map((msg: any) => ({
            ...msg,
            sentAt: new Date(msg.sentAt),
            readAt: msg.readAt ? new Date(msg.readAt) : null
          } as Message));
        }
        return response as PagedResponse;
      }),
      tap(() => {
        // Update unread count after viewing a conversation
        this.loadUnreadMessageCount();
      }),
      catchError(error => {
        console.error(`Error fetching paginated conversation with user ${userId}:`, error);
        return of({ content: [], totalElements: 0, totalPages: 0 } as PagedResponse);
      })
    );
  }

  // Send a message
  sendMessage(request: SendMessageRequest): Observable<Message> {
    return this.http.post<any>(`${this.apiUrl}`, request).pipe(
      map(message => ({
        ...message,
        sentAt: new Date(message.sentAt),
        readAt: message.readAt ? new Date(message.readAt) : null
      } as Message)),
      catchError(error => {
        console.error('Error sending message:', error);
        throw error;
      })
    );
  }

  // Mark a message as read
  markAsRead(messageId: number): Observable<Message> {
    return this.http.put<any>(`${this.apiUrl}/${messageId}/read`, {}).pipe(
      map(message => ({
        ...message,
        sentAt: new Date(message.sentAt),
        readAt: message.readAt ? new Date(message.readAt) : null
      } as Message)),
      tap(() => {
        this.loadUnreadMessageCount();
      }),
      catchError(error => {
        console.error(`Error marking message ${messageId} as read:`, error);
        throw error;
      })
    );
  }

  // Mark all messages in a conversation as read
  markConversationAsRead(userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/conversations/${userId}/read`, {}).pipe(
      tap(() => {
        this.loadUnreadMessageCount();
      }),
      catchError(error => {
        console.error(`Error marking conversation with user ${userId} as read:`, error);
        throw error;
      })
    );
  }

  // Get count of unread messages
  getUnreadMessageCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread/count`).pipe(
      tap(count => {
        this.unreadCountSubject.next(count);
      }),
      catchError(error => {
        console.error('Error fetching unread message count:', error);
        return of(0);
      })
    );
  }

  // Load the unread message count
  private loadUnreadMessageCount(): void {
    this.getUnreadMessageCount().subscribe();
  }
} 