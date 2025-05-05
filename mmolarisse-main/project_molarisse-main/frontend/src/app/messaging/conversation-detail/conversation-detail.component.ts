import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MessagingService, Message } from '../../core/services/messaging.service';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-conversation-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTooltipModule
  ],
  template: `
    <div class="conversation-container">
      <!-- Header -->
      <div class="conversation-header">
        <div class="conversation-partner">
          <div *ngIf="!partnerProfilePicture" class="avatar-placeholder">
            {{ getInitials(partnerName) }}
          </div>
          <img *ngIf="partnerProfilePicture" [src]="partnerProfilePicture" alt="{{ partnerName }}">
          <div class="partner-info">
            <h2>{{ partnerName }}</h2>
            <span class="partner-role">{{ getRoleBadge(partnerRole) }}</span>
          </div>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <!-- Messages -->
      <div class="messages-container" #messagesContainer>
        <div *ngIf="loading" class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
        
        <div *ngIf="!loading && messages.length === 0" class="empty-state">
          <mat-icon>chat</mat-icon>
          <p>Aucun message</p>
          <p class="empty-subtitle">Commencez la conversation dès maintenant</p>
        </div>
        
        <div *ngIf="!loading && messages.length > 0" class="messages-list">
          <div *ngFor="let message of messages; let i = index" 
               class="message-wrapper"
               [class.my-message]="message.isMine"
               [class.first-of-group]="isFirstMessageOfGroup(message, i)"
               [class.last-of-group]="isLastMessageOfGroup(message, i)">
            
            <div class="message-avatar" *ngIf="isFirstMessageOfGroup(message, i) && !message.isMine">
              <div *ngIf="!message.senderProfilePicture" class="avatar-placeholder small">
                {{ getInitials(message.senderName) }}
              </div>
              <img *ngIf="message.senderProfilePicture" [src]="message.senderProfilePicture" alt="{{ message.senderName }}">
            </div>
            <div class="message-spacer" *ngIf="!isFirstMessageOfGroup(message, i) || message.isMine"></div>
            
            <div class="message-bubble" [class.my-bubble]="message.isMine">
              <div class="message-content">{{ message.content }}</div>
              <div class="message-time" [matTooltip]="formatFullDate(message.sentAt)">
                {{ formatTime(message.sentAt) }}
                <mat-icon *ngIf="message.isMine && message.isRead" class="read-icon">done_all</mat-icon>
                <mat-icon *ngIf="message.isMine && !message.isRead" class="unread-icon">done</mat-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Message Input -->
      <div class="message-input-container">
        <mat-form-field appearance="outline" class="message-input">
          <mat-label>Écrivez un message...</mat-label>
          <textarea 
            matInput 
            [(ngModel)]="newMessage" 
            placeholder="Écrivez un message..." 
            [rows]="1"
            (keydown)="handleKeyDown($event)"
            #messageInput></textarea>
          <mat-icon matSuffix>chat</mat-icon>
        </mat-form-field>
        
        <button 
          mat-fab 
          color="primary" 
          class="send-button" 
          [disabled]="!newMessage?.trim()" 
          (click)="sendMessage()">
          <mat-icon>send</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .conversation-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .conversation-header {
      padding: 12px 16px;
      background-color: #fff;
    }
    
    .conversation-partner {
      display: flex;
      align-items: center;
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
      margin-right: 12px;
    }
    
    .avatar-placeholder.small {
      width: 32px;
      height: 32px;
      font-size: 12px;
    }
    
    .conversation-partner img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 12px;
    }
    
    .partner-info {
      display: flex;
      flex-direction: column;
    }
    
    .partner-info h2 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }
    
    .partner-role {
      font-size: 12px;
      color: #666;
    }
    
    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background-color: #f9f9f9;
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
    
    .messages-list {
      display: flex;
      flex-direction: column;
      padding-bottom: 10px;
    }
    
    .message-wrapper {
      display: flex;
      margin-bottom: 4px;
    }
    
    .message-wrapper.my-message {
      justify-content: flex-end;
    }
    
    .message-wrapper.first-of-group {
      margin-top: 16px;
    }
    
    .message-wrapper.last-of-group {
      margin-bottom: 16px;
    }
    
    .message-avatar {
      margin-right: 8px;
      align-self: flex-end;
    }
    
    .message-spacer {
      width: 40px;
    }
    
    .message-bubble {
      max-width: 70%;
      padding: 8px 12px;
      border-radius: 18px;
      background-color: #fff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      position: relative;
      margin-bottom: 2px;
    }
    
    .my-bubble {
      background-color: #d1e7dd;
      color: #333;
    }
    
    .message-content {
      font-size: 14px;
      margin-bottom: 2px;
      word-wrap: break-word;
    }
    
    .message-time {
      font-size: 10px;
      color: #999;
      text-align: right;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    
    .read-icon, .unread-icon {
      font-size: 14px;
      height: 14px;
      width: 14px;
      margin-left: 4px;
    }
    
    .read-icon {
      color: #4caf50;
    }
    
    .unread-icon {
      color: #9e9e9e;
    }
    
    .message-input-container {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      background-color: #fff;
      border-top: 1px solid #e0e0e0;
    }
    
    .message-input {
      flex: 1;
      margin-right: 12px;
    }
    
    .send-button {
      width: 48px;
      height: 48px;
    }
    
    ::ng-deep .message-input .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
  `]
})
export class ConversationDetailComponent implements OnInit, OnDestroy, AfterViewChecked, OnChanges {
  @Input() userId: number | null = null;
  partnerId: number = 0;
  partnerName: string = '';
  partnerRole: string = '';
  partnerProfilePicture: string = '';
  messages: Message[] = [];
  loading: boolean = true;
  newMessage: string = '';
  
  private refreshSubscription: Subscription | undefined;
  
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;
  
  constructor(
    private route: ActivatedRoute,
    private messagingService: MessagingService
  ) {}
  
  ngOnInit(): void {
    // If userId is not provided via Input, try to get it from the route
    if (!this.userId) {
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        if (idParam) {
          this.partnerId = parseInt(idParam, 10);
          this.loadConversation();
          
          // Set up automatic refresh every 10 seconds
          this.setupAutoRefresh();
        }
      });
    } else {
      this.partnerId = this.userId;
      this.loadConversation();
      
      // Set up automatic refresh every 10 seconds
      this.setupAutoRefresh();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // Respond to changes in the userId Input
    if (changes['userId'] && !changes['userId'].firstChange) {
      if (this.userId) {
        this.partnerId = this.userId;
        this.loadConversation();
        
        // Make sure auto-refresh is set up
        if (!this.refreshSubscription) {
          this.setupAutoRefresh();
        }
      }
    }
  }
  
  ngOnDestroy(): void {
    // Clean up the refresh subscription
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  
  ngAfterViewChecked(): void {
    // Scroll to bottom after view is checked
    this.scrollToBottom();
  }
  
  private setupAutoRefresh(): void {
    // Set up automatic refresh every 10 seconds
    this.refreshSubscription = interval(10000).pipe(
      switchMap(() => this.messagingService.getConversation(this.partnerId))
    ).subscribe(messages => {
      this.updateMessages(messages);
    });
  }
  
  loadConversation(): void {
    this.loading = true;
    this.messagingService.getConversation(this.partnerId).subscribe({
      next: (messages) => {
        this.updateMessages(messages);
        this.loading = false;
        
        // Focus the message input after loading
        setTimeout(() => {
          if (this.messageInput) {
            this.messageInput.nativeElement.focus();
          }
        }, 0);
      },
      error: (error) => {
        console.error('Error loading conversation:', error);
        this.loading = false;
      }
    });
  }
  
  updateMessages(messages: Message[]): void {
    this.messages = messages;
    
    if (messages.length > 0) {
      const firstMessage = messages[0];
      
      // Update partner info based on first message
      if (firstMessage.isMine) {
        this.partnerName = firstMessage.recipientName;
        this.partnerProfilePicture = firstMessage.recipientProfilePicture;
      } else {
        this.partnerName = firstMessage.senderName;
        this.partnerProfilePicture = firstMessage.senderProfilePicture;
      }
      
      // Attempt to determine partner role (would need to be included in the message model)
      // For now, we'll just default to "Utilisateur"
      this.partnerRole = 'utilisateur';
    }
  }
  
  sendMessage(event?: KeyboardEvent): void {
    if (!this.newMessage?.trim()) return;
    
    if (event) {
      event.preventDefault();
    }
    
    const content = this.newMessage.trim();
    this.newMessage = '';
    
    // Optimistically add message to UI
    const optimisticMessage: Message = {
      id: -1, // Temporary ID
      senderId: -1, // Will be set by server
      senderName: 'Moi',
      senderProfilePicture: '',
      recipientId: this.partnerId,
      recipientName: this.partnerName,
      recipientProfilePicture: this.partnerProfilePicture,
      content: content,
      sentAt: new Date(),
      readAt: null,
      isRead: false,
      isMine: true
    };
    
    this.messages = [...this.messages, optimisticMessage];
    
    // Scroll to bottom after adding message
    setTimeout(() => this.scrollToBottom(), 0);
    
    // Send message to server
    this.messagingService.sendMessage({
      recipientId: this.partnerId,
      content: content
    }).subscribe({
      next: (message) => {
        // Replace optimistic message with actual message
        this.messages = this.messages.map(msg => 
          msg === optimisticMessage ? message : msg
        );
      },
      error: (error) => {
        console.error('Error sending message:', error);
        // Handle error (e.g., show error state on message)
      }
    });
  }
  
  scrollToBottom(): void {
    try {
      const container = this.messagesContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
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
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const messageDate = new Date(date);
    const messageDateOnly = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());
    
    if (messageDateOnly.getTime() === today.getTime()) {
      // Today, show time only
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (messageDateOnly.getTime() === yesterday.getTime()) {
      // Yesterday
      return 'Hier';
    } else {
      // Other days, show date only
      return messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
  }
  
  formatFullDate(date: Date): string {
    if (!date) return '';
    
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(date).toLocaleDateString('fr-FR', options);
  }
  
  isFirstMessageOfGroup(message: Message, index: number): boolean {
    if (index === 0) return true;
    const prevMessage = this.messages[index - 1];
    return prevMessage.isMine !== message.isMine;
  }
  
  isLastMessageOfGroup(message: Message, index: number): boolean {
    if (index === this.messages.length - 1) return true;
    const nextMessage = this.messages[index + 1];
    return nextMessage.isMine !== message.isMine;
  }
  
  getRoleBadge(role: string): string {
    if (!role) return '';
    
    switch(role.toLowerCase()) {
      case 'doctor': return 'Médecin';
      case 'secretaire': return 'Secrétaire';
      case 'patient': return 'Patient';
      case 'admin': return 'Administrateur';
      case 'utilisateur': return 'Utilisateur';
      default: return role;
    }
  }
  
  handleKeyDown(event: KeyboardEvent): void {
    // Send message on Enter key press (without Shift)
    if (event.key === 'Enter' && !event.shiftKey) {
      this.sendMessage(event);
    }
  }
} 