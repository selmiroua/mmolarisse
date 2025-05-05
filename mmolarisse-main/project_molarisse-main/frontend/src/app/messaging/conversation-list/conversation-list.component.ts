import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessagingService, Conversation } from '../../core/services/messaging.service';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  template: `
    <div class="conversations-container">
      <div class="conversations-header">
        <h2>Conversations</h2>
        <button mat-icon-button (click)="loadConversations()">
          <mat-icon>refresh</mat-icon>
        </button>
      </div>
      
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
      
      <div *ngIf="!loading && conversations.length === 0" class="empty-state">
        <mat-icon>chat</mat-icon>
        <p>Aucune conversation</p>
        <p class="empty-subtitle">Vous n'avez pas encore de messages</p>
      </div>
      
      <mat-nav-list *ngIf="!loading && conversations.length > 0">
        <a mat-list-item 
           *ngFor="let conversation of conversations" 
           [attr.data-partner-id]="conversation.partnerId"
           class="conversation-item"
           [class.unread]="conversation.unreadCount > 0">
          
          <div class="conversation-avatar" matListItemAvatar>
            <div *ngIf="!conversation.profilePicture" class="avatar-placeholder">
              {{ getInitials(conversation.partnerName) }}
            </div>
            <img *ngIf="conversation.profilePicture" [src]="conversation.profilePicture" alt="{{ conversation.partnerName }}">
            
            <div *ngIf="conversation.unreadCount > 0" class="unread-badge">
              {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
            </div>
          </div>
          
          <div matListItemTitle class="conversation-title">
            <span>{{ conversation.partnerName }}</span>
            <span class="conversation-time">{{ formatTime(conversation.lastMessageTime) }}</span>
          </div>
          
          <div matListItemLine class="conversation-subtitle">
            <span *ngIf="conversation.isLastMessageMine" class="sent-indicator">
              <mat-icon>send</mat-icon>
            </span>
            <span class="message-preview" [class.message-preview-bold]="conversation.unreadCount > 0">
              {{ truncateMessage(conversation.lastMessageContent) }}
            </span>
          </div>
          
          <div class="conversation-role-badge">
            {{ getRoleBadge(conversation.partnerRole) }}
          </div>
        </a>
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .conversations-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .conversations-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 16px 8px;
    }
    
    .conversations-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.2rem;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 40px 0;
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }
    
    .empty-state mat-icon {
      font-size: 48px;
      height: 48px;
      width: 48px;
      margin-bottom: 16px;
      color: #ccc;
    }
    
    .empty-state p {
      margin: 0;
      color: #555;
      font-size: 18px;
    }
    
    .empty-subtitle {
      font-size: 14px !important;
      color: #999 !important;
      margin-top: 8px !important;
    }
    
    .conversation-item {
      position: relative;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .conversation-item.unread {
      background-color: rgba(55, 131, 146, 0.05);
    }
    
    .conversation-avatar {
      position: relative;
    }
    
    .avatar-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #378392;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
    }
    
    .conversation-avatar img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .unread-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #f44336;
      color: white;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .conversation-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    
    .conversation-time {
      font-size: 12px;
      color: #888;
      font-weight: normal;
    }
    
    .conversation-subtitle {
      display: flex;
      align-items: center;
      margin-top: 2px;
    }
    
    .sent-indicator {
      margin-right: 8px;
      display: flex;
      align-items: center;
    }
    
    .sent-indicator mat-icon {
      font-size: 14px;
      height: 14px;
      width: 14px;
      color: #888;
    }
    
    .message-preview {
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80%;
    }
    
    .message-preview-bold {
      font-weight: 500;
      color: #333;
    }
    
    .conversation-role-badge {
      position: absolute;
      top: 8px;
      right: 16px;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 10px;
      background-color: #e0e0e0;
      color: #555;
    }
  `]
})
export class ConversationListComponent implements OnInit, OnDestroy {
  conversations: Conversation[] = [];
  loading = true;
  private refreshSubscription: Subscription | undefined;
  
  constructor(
    private messagingService: MessagingService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadConversations();
    
    // Refresh conversations every 30 seconds
    this.refreshSubscription = interval(30000).pipe(
      switchMap(() => this.messagingService.getConversations())
    ).subscribe(
      conversations => {
        this.conversations = this.sortConversations(conversations);
      }
    );
  }
  
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  
  loadConversations(): void {
    this.loading = true;
    this.messagingService.getConversations().subscribe(
      conversations => {
        this.conversations = this.sortConversations(conversations);
        this.loading = false;
      },
      error => {
        console.error('Error loading conversations:', error);
        this.loading = false;
      }
    );
  }
  
  sortConversations(conversations: Conversation[]): Conversation[] {
    return conversations.sort((a, b) => 
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
  }
  
  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  
  formatTime(date: Date): string {
    if (!date) return '';
    
    const now = new Date();
    const messageDate = new Date(date);
    
    // If the message is from today, show the time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // If the message is from this week, show the day
    const daysDiff = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return messageDate.toLocaleDateString('fr-FR', { weekday: 'short' });
    }
    
    // Otherwise, show the date
    return messageDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }
  
  truncateMessage(message: string): string {
    if (!message) return '';
    return message.length > 40 ? message.substring(0, 40) + '...' : message;
  }
  
  getRoleBadge(role: string): string {
    if (!role) return '';
    
    switch(role.toLowerCase()) {
      case 'doctor': return 'Médecin';
      case 'secretaire': return 'Secrétaire';
      case 'patient': return 'Patient';
      default: return role;
    }
  }
} 