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
import { environment } from '../../../environments/environment';

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
          <img *ngIf="partnerProfilePicture" [src]="partnerProfilePicture" alt="{{ partnerName }}" (error)="handleImageError($event)">
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
            
            <!-- Skip showing avatars completely -->
            <div class="message-spacer"></div>
            
            <div class="message-bubble" [class.my-bubble]="message.isMine">
              <div class="message-content">
                <!-- Image message -->
                <img *ngIf="message.mediaType === 'IMAGE' && message.mediaPath" 
                     [src]="getMediaUrl(message.mediaPath)" 
                     alt="Image partagée" 
                     (error)="handleImageError($event)"
                     (click)="openImagePreview(message.mediaPath)">
                
                <!-- Voice message -->
                <div *ngIf="message.mediaType === 'VOICE' && message.mediaPath" class="voice-message">
                  <mat-icon class="voice-icon">mic</mat-icon>
                  <div *ngIf="message.mediaPath" class="debug-info">
                    Media: {{message.mediaPath}}<br>
                    URL: {{getMediaUrl(message.mediaPath)}}
                  </div>
                  <audio controls (error)="handleAudioError($event)" preload="metadata">
                    <source [src]="getMediaUrl(message.mediaPath)" [type]="getContentType(message.mediaPath)">
                    <span>Votre navigateur ne supporte pas les fichiers audio.</span>
                  </audio>
                  <small *ngIf="message.content" class="audio-caption">{{message.content}}</small>
                  <div class="audio-action-buttons">
                    <button mat-button color="primary" class="retry-button" (click)="retryAudioLoad($event, message.mediaPath)">
                      <mat-icon>refresh</mat-icon> Retry
                    </button>
                    <button mat-button color="accent" class="debug-button" (click)="debugAudio($event, message.mediaPath)">
                      <mat-icon>bug_report</mat-icon> Debug
                    </button>
                    <button mat-button color="warn" class="play-direct-button" (click)="playAudioDirectly($event, message.mediaPath)">
                      <mat-icon>play_circle</mat-icon> Play
                    </button>
                    <button mat-button color="warn" class="play-blob-button" (click)="playViaBlob($event, message.mediaPath)">
                      <mat-icon>cloud_download</mat-icon> Play via Blob
                    </button>
                    <button mat-button class="diagnose-button" (click)="diagnoseMediaIssues($event, message.mediaPath)">
                      <mat-icon>health_and_safety</mat-icon> Diagnose
                    </button>
                  </div>
                </div>
                
                <!-- Text message -->
                <span *ngIf="!message.mediaType">{{ message.content }}</span>
              </div>
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
        <!-- Voice recording section -->
        <div *ngIf="isRecording" class="recording-container">
          <div class="recording-indicator">
            <span>{{ recordingDuration }}</span>
            <div class="recording-blob"></div>
          </div>
          <button 
            mat-mini-fab 
            color="warn" 
            class="recording-button"
            (click)="stopRecording()">
            <mat-icon>stop</mat-icon>
          </button>
        </div>

        <!-- Normal input section -->
        <div *ngIf="!isRecording" class="normal-input-container">
          <button 
            mat-icon-button 
            class="attachment-button" 
            (click)="fileInput.click()">
            <mat-icon>attach_file</mat-icon>
          </button>
          <input 
            #fileInput 
            type="file" 
            hidden 
            accept="image/*" 
            (change)="onFileSelected($event)">
          
          <button 
            mat-icon-button 
            class="mic-button" 
            (click)="startRecording()">
            <mat-icon>mic</mat-icon>
          </button>
          
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
            [disabled]="!newMessage?.trim() && !selectedFile && !audioBlob" 
            (click)="sendMessage()">
            <mat-icon>send</mat-icon>
          </button>
        </div>
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
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #378392;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      margin-right: 12px;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    
    .avatar-placeholder.small {
      width: 32px;
      height: 32px;
      font-size: 12px;
      margin-right: 8px;
    }
    
    .conversation-partner img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 12px;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
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
      margin-bottom: 8px;
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
    
    .message-spacer {
      width: 16px;
    }
    
    .message-bubble {
      max-width: 75%;
      padding: 10px 14px;
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
    
    .message-content img {
      max-width: 100%;
      max-height: 200px;
      border-radius: 8px;
      margin: 4px 0;
      cursor: pointer;
    }
    
    .voice-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 4px 0;
      background-color: rgba(0, 0, 0, 0.03);
      border-radius: 8px;
      padding: 8px;
    }
    
    .voice-icon {
      color: #378392;
      margin-bottom: 4px;
    }
    
    .voice-message audio {
      width: 100%;
      height: 36px;
    }
    
    .audio-caption {
      color: #777;
      margin-top: 4px;
      font-style: italic;
    }
    
    .debug-info {
      font-size: 10px;
      background-color: #f0f0f0;
      padding: 2px 6px;
      border-radius: 4px;
      margin-bottom: 4px;
      word-break: break-all;
      color: #666;
      border: 1px dashed #ccc;
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
    
    .normal-input-container {
      display: flex;
      align-items: center;
      width: 100%;
    }
    
    .recording-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0 8px;
    }
    
    .recording-indicator {
      display: flex;
      align-items: center;
      color: #f44336;
      font-size: 14px;
    }
    
    .recording-blob {
      width: 12px;
      height: 12px;
      background-color: #f44336;
      border-radius: 50%;
      margin-left: 8px;
      animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
      0% {
        transform: scale(0.8);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      100% {
        transform: scale(0.8);
        opacity: 0.7;
      }
    }
    
    .recording-button {
      margin-left: 12px;
    }
    
    .message-input {
      flex: 1;
      margin-right: 12px;
    }
    
    .send-button {
      width: 48px;
      height: 48px;
    }
    
    .attachment-button, .mic-button {
      margin-right: 8px;
    }
    
    ::ng-deep .message-input .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
    
    .retry-button {
      font-size: 12px;
      line-height: 24px;
      margin-top: 4px;
      border: 1px solid #ddd;
    }
    
    .retry-button mat-icon {
      font-size: 16px;
      height: 16px;
      width: 16px;
      vertical-align: middle;
      margin-right: 4px;
    }
    
    .audio-debug-container {
      background-color: #f8f8f8;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 8px;
      margin-top: 8px;
      font-family: monospace;
      font-size: 11px;
    }
    
    .audio-debug-item {
      margin-bottom: 4px;
      display: flex;
    }
    
    .audio-debug-label {
      font-weight: bold;
      color: #555;
      min-width: 100px;
    }
    
    .audio-debug-value {
      color: #0066cc;
      word-break: break-all;
    }
    
    .audio-action-buttons {
      display: flex;
      gap: 8px;
      margin-top: 4px;
    }
    
    .debug-button {
      font-size: 12px;
      line-height: 24px;
      border: 1px solid #ddd;
    }
    
    .play-direct-button {
      font-size: 12px;
      line-height: 24px;
      border: 1px solid #ffcdd2;
    }
    
    .play-blob-button {
      font-size: 12px;
      line-height: 24px;
      border: 1px solid #e0e0e0;
      background-color: #f8f8f8;
    }
    
    .diagnose-button {
      font-size: 12px;
      line-height: 24px;
      border: 1px solid #c8e6c9;
      background-color: #f1f8e9;
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
  
  // Media attachment properties
  selectedFile: File | null = null;
  isRecording: boolean = false;
  recordingDuration: string = '00:00';
  audioBlob: Blob | null = null;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  recordingTimer: any;
  recordingStartTime: number = 0;
  
  private refreshSubscription: Subscription | undefined;
  
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;
  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;
  
  constructor(
    private route: ActivatedRoute,
    private messagingService: MessagingService
  ) {}
  
  ngOnInit(): void {
    console.log('ConversationDetail - ngOnInit called with userId:', this.userId);
    // Debug line for media URL
    console.log('API URL for media:', `${environment.apiUrl}/api/v1/api/messages/media/[filename]`);
    
    // Test backend connectivity
    this.testBackendConnectivity();
    
    // If userId is not provided via Input, try to get it from the route
    if (!this.userId) {
      console.log('ConversationDetail - No userId provided as input, checking route');
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        console.log('ConversationDetail - Route id param:', idParam);
        if (idParam) {
          this.partnerId = parseInt(idParam, 10);
          console.log('ConversationDetail - Setting partnerId from route:', this.partnerId);
          this.loadConversation();
          
          // Set up automatic refresh every 10 seconds
          this.setupAutoRefresh();
        }
      });
    } else {
      console.log('ConversationDetail - Using userId from input:', this.userId);
      this.partnerId = this.userId;
      this.loadConversation();
      
      // Set up automatic refresh every 10 seconds
      this.setupAutoRefresh();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // Respond to changes in the userId Input
    console.log('ConversationDetail - ngOnChanges called with userId:', this.userId, 'changes:', changes);
    if (changes['userId']) {
      console.log('ConversationDetail - userId changed to:', changes['userId'].currentValue);
      if (this.userId) {
        this.partnerId = this.userId;
        console.log('ConversationDetail - Setting partnerId from userId change:', this.partnerId);
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
    console.log('ConversationDetail - loadConversation called for partnerId:', this.partnerId);
    this.loading = true;
    this.messagingService.getConversation(this.partnerId).subscribe({
      next: (messages) => {
        console.log('ConversationDetail - Received messages:', messages);
        
        // Debug any media messages
        messages.forEach(msg => {
          if (msg.mediaType) {
            console.log(`Media message found: Type=${msg.mediaType}, Path=${msg.mediaPath}`);
          }
        });
        
        // Process profile images in messages
        messages = messages.map(msg => {
          if (msg.senderProfilePicture) {
            msg.senderProfilePicture = this.getProfileImageUrl(msg.senderProfilePicture);
          }
          if (msg.recipientProfilePicture) {
            msg.recipientProfilePicture = this.getProfileImageUrl(msg.recipientProfilePicture);
          }
          return msg;
        });
        
        this.updateMessages(messages);
        this.loading = false;
        
        // Debug media info after loading
        this.displayMediaInfo();
        
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
    
    // Debug all messages to check media content
    setTimeout(() => this.debugMessages(), 1000);
    
    if (messages.length > 0) {
      const firstMessage = messages[0];
      
      // Update partner info based on first message
      if (firstMessage.isMine) {
        this.partnerName = firstMessage.recipientName;
        
        // Fix profile picture URL
        if (firstMessage.recipientProfilePicture) {
          this.partnerProfilePicture = this.getProfileImageUrl(firstMessage.recipientProfilePicture);
        } else {
          this.partnerProfilePicture = 'assets/images/default-avatar.png';
        }
      } else {
        this.partnerName = firstMessage.senderName;
        
        // Fix profile picture URL
        if (firstMessage.senderProfilePicture) {
          this.partnerProfilePicture = this.getProfileImageUrl(firstMessage.senderProfilePicture);
        } else {
          this.partnerProfilePicture = 'assets/images/default-avatar.png';
        }
      }
      
      // Attempt to determine partner role (would need to be included in the message model)
      // For now, we'll just default to "Utilisateur"
      this.partnerRole = 'utilisateur';
    }
  }
  
  // Handle file selection for image upload
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Automatically send the message when a file is selected
      this.sendMessage();
    }
  }
  
  // Start voice recording
  startRecording(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          this.isRecording = true;
          this.recordedChunks = [];
          this.recordingStartTime = Date.now();
          
          // Update recording duration
          this.recordingTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            this.recordingDuration = `${minutes}:${seconds}`;
          }, 1000);
          
          // Setup media recorder with specified audio format
          this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'audio/webm'
          });
          
          this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              this.recordedChunks.push(event.data);
            }
          };
          
          this.mediaRecorder.onstop = () => {
            // Combine chunks into a single audio blob
            this.audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
            stream.getTracks().forEach(track => track.stop());
            
            console.log('Recording completed, blob size:', this.audioBlob.size);
            
            // Automatically send the message when recording stops
            this.sendMessage();
          };
          
          this.mediaRecorder.start();
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
          alert('Impossible d\'accéder au microphone. Veuillez vérifier les permissions de votre navigateur.');
        });
    } else {
      alert('Votre navigateur ne prend pas en charge l\'enregistrement audio.');
    }
  }
  
  // Stop voice recording
  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      clearInterval(this.recordingTimer);
      this.recordingDuration = '00:00';
    }
  }
  
  // Get media URL from path
  getMediaUrl(path: string | undefined): string {
    if (!path) return '';
    
    if (path.startsWith('http') || path.startsWith('blob:')) {
      return path;
    } else {
      // Keep the existing API endpoint path
      const url = `${environment.apiUrl}/api/v1/api/messages/media/${path}`;
      console.log('Media URL generated:', url);
      return url;
    }
  }
  
  // Get content type based on file extension
  getContentType(path: string | undefined): string {
    if (!path) return 'audio/mpeg'; // Default
    
    if (path.endsWith('.webm')) {
      return 'audio/webm';
    } else if (path.endsWith('.mp3')) {
      return 'audio/mpeg';
    } else if (path.endsWith('.wav')) {
      return 'audio/wav';
    } else if (path.endsWith('.m4a')) {
      return 'audio/mp4';
    } else if (path.endsWith('.ogg')) {
      return 'audio/ogg';
    }
    
    return 'audio/mpeg'; // Default fallback
  }
  
  // Open image preview in a larger view
  openImagePreview(mediaPath: string): void {
    if (!mediaPath) return;
    
    const url = this.getMediaUrl(mediaPath);
    window.open(url, '_blank');
  }
  
  // Send message with potential media attachment
  sendMessage(event?: any): void {
    if (event) {
      event.preventDefault();
    }
    
    const content = this.newMessage.trim();
    
    // If neither text content, file, nor audio is present, do nothing
    if (!content && !this.selectedFile && !this.audioBlob) {
      return;
    }
    
    // Clear message input
    this.newMessage = '';
    
    // Prepare message data
    let mediaType: 'IMAGE' | 'VOICE' | undefined;
    let mediaFile: File | null = null;
    
    if (this.selectedFile) {
      mediaType = 'IMAGE';
      mediaFile = this.selectedFile;
      this.selectedFile = null;
      // Clear file input
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    } else if (this.audioBlob) {
      mediaType = 'VOICE';
      
      // Create a proper audio file with appropriate format
      // Use .mp3 extension as it's widely supported
      let fileExtension = '.mp3';
      if (this.audioBlob.type.includes('webm')) {
        fileExtension = '.webm';
      }
      
      mediaFile = new File([this.audioBlob], `voice-message${fileExtension}`, { 
        type: this.audioBlob.type || 'audio/mpeg' 
      });
      
      console.log('Created voice message file:', mediaFile.name, mediaFile.type, mediaFile.size);
      this.audioBlob = null;
    }
    
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
      mediaType: mediaType,
      mediaPath: mediaFile ? URL.createObjectURL(mediaFile) : undefined,
      sentAt: new Date(),
      readAt: null,
      isRead: false,
      isMine: true
    };
    
    this.messages = [...this.messages, optimisticMessage];
    
    // Scroll to bottom after adding message
    setTimeout(() => this.scrollToBottom(), 0);
    
    // Prepare form data for file upload
    if (mediaFile) {
      const formData = new FormData();
      formData.append('recipientId', this.partnerId.toString());
      formData.append('content', content);
      formData.append('mediaType', mediaType as string);
      formData.append('media', mediaFile, mediaFile.name);
      
      console.log('Sending media message:', mediaType, mediaFile.name, mediaFile.size);
      
      // Send message with media to server
      this.messagingService.sendMessageWithMedia(formData).subscribe({
        next: (message) => {
          console.log('Media message sent successfully:', message);
          // Replace optimistic message with actual message
          this.messages = this.messages.map(msg => 
            msg === optimisticMessage ? message : msg
          );
        },
        error: (error) => {
          console.error('Error sending message with media:', error);
          // Handle error (e.g., show error state on message)
        }
      });
    } else {
      // Send text-only message to server
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
  
  getProfileImageUrl(profilePicturePath?: string): string {
    if (profilePicturePath) {
      // Check if it's already a full URL
      if (profilePicturePath.startsWith('http')) {
        return profilePicturePath;
      }
      try {
        const timestamp = new Date().getTime();
        return `${environment.apiUrl}/api/users/profile/picture/${profilePicturePath}?t=${timestamp}`;
      } catch (error) {
        console.error('Error generating profile picture URL:', error);
        return 'assets/images/default-avatar.png';
      }
    }
    return 'assets/images/default-avatar.png';
  }
  
  handleImageError(event: any): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-avatar.png';
  }
  
  displayMediaInfo(): void {
    this.messages.forEach(msg => {
      if (msg.mediaType && msg.mediaPath) {
        console.log(`Message ID: ${msg.id}, Type: ${msg.mediaType}, Path: ${msg.mediaPath}, URL: ${this.getMediaUrl(msg.mediaPath)}`);
      }
    });
  }
  
  handleAudioError(event: any): void {
    console.error('Audio playback error:', event);
    const audioElement = event.target as HTMLAudioElement;
    console.log('Audio source:', audioElement.currentSrc);
    console.log('Audio error code:', audioElement.error?.code);
    console.log('Audio error message:', audioElement.error?.message);
    
    // Create a direct fetch to test accessibility
    const sourcePath = audioElement.querySelector('source')?.getAttribute('src') || '';
    if (sourcePath) {
      console.log('Testing direct fetch for audio file:', sourcePath);
      fetch(sourcePath, { method: 'HEAD' })
        .then(response => {
          console.log('Direct fetch response:', response.status, response.statusText);
          console.log('Content-Type:', response.headers.get('Content-Type'));
        })
        .catch(error => {
          console.error('Direct fetch error:', error);
        });
    }
    
    // Try to reload the audio with a timestamp to avoid caching
    setTimeout(() => {
      const sources = audioElement.querySelectorAll('source');
      sources.forEach((source: HTMLSourceElement) => {
        const originalSrc = source.src;
        if (originalSrc.indexOf('?') === -1) {
          source.src = `${originalSrc}?t=${new Date().getTime()}`;
        }
      });
      audioElement.load();
      audioElement.play().catch(e => console.error('Error playing audio after reload:', e));
    }, 500);
  }
  
  // Add this method to display debug information for testing
  debugMessages(): void {
    console.group('Debugging all messages:');
    
    this.messages.forEach((msg, index) => {
      console.log(`Message ${index}:`, {
        id: msg.id,
        content: msg.content,
        mediaType: msg.mediaType, 
        mediaPath: msg.mediaPath,
        mediaUrl: msg.mediaPath ? this.getMediaUrl(msg.mediaPath) : 'none'
      });
    });
    
    // Test if we can fetch the media files directly
    this.messages.forEach((msg, index) => {
      if (msg.mediaType && msg.mediaPath) {
        const mediaUrl = this.getMediaUrl(msg.mediaPath);
        console.log(`Testing fetch for message ${index} (${msg.mediaType}):`, mediaUrl);
        
        fetch(mediaUrl)
          .then(response => {
            console.log(`Media fetch response for ${mediaUrl}:`, 
              response.status, response.statusText, 
              response.headers.get('Content-Type'));
            return response.blob();
          })
          .then(blob => {
            console.log(`Media blob received for ${mediaUrl}:`, blob.type, blob.size);
          })
          .catch(error => {
            console.error(`Error fetching media for ${mediaUrl}:`, error);
          });
      }
    });
    
    console.groupEnd();
  }
  
  retryAudioLoad(event: Event, mediaPath?: string): void {
    if (!mediaPath) return;
    
    // Prevent event bubbling
    event.stopPropagation();
    event.preventDefault();
    
    // Find the closest audio element
    const button = event.target as HTMLElement;
    const audioElement = button.closest('.voice-message')?.querySelector('audio');
    
    if (audioElement) {
      console.log('Manually retrying audio load for:', mediaPath);
      
      // Create direct URL with timestamp
      const url = `${this.getMediaUrl(mediaPath)}?t=${new Date().getTime()}`;
      
      // Set source with explicit type
      const contentType = this.getContentType(mediaPath);
      audioElement.innerHTML = `<source src="${url}" type="${contentType}">`;
      
      // Force reload
      audioElement.load();
      
      // Attempt to play
      audioElement.play()
        .then(() => console.log('Successfully playing audio after manual retry'))
        .catch(error => console.error('Error playing after manual retry:', error));
    }
  }
  
  testBackendConnectivity(): void {
    // Test different endpoints to diagnose connectivity issues
    console.log('Testing backend connectivity...');
    
    // Test 1: Base API URL
    fetch(`${environment.apiUrl}/api/v1/api/messages/test-connectivity`, { method: 'OPTIONS' })
      .then(response => {
        console.log('Base API connectivity test response:', response.status, response.statusText);
      })
      .catch(error => {
        console.error('Base API connectivity error:', error);
      });
    
    // Test 2: Directly try to access a known media file
    if (this.messages && this.messages.length > 0) {
      const mediaMessage = this.messages.find(msg => msg.mediaType === 'VOICE' && msg.mediaPath);
      if (mediaMessage && mediaMessage.mediaPath) {
        const mediaUrl = this.getMediaUrl(mediaMessage.mediaPath);
        console.log('Testing direct media access for:', mediaUrl);
        
        fetch(mediaUrl, { method: 'HEAD' })
          .then(response => {
            console.log('Media file access test:', response.status, response.statusText);
            console.log('Content-Type:', response.headers.get('Content-Type'));
          })
          .catch(error => {
            console.error('Media file access error:', error);
          });
      }
    }
    
    // Test 3: Try all the .webm files we found earlier
    const webmFiles = ['2d716fa5-5bf1-436a-ab42-bab68497b922.webm', 'e138f9a6-5102-4074-bf10-f15273570414.webm'];
    webmFiles.forEach(filename => {
      const url = `${environment.apiUrl}/api/v1/api/messages/media/${filename}`;
      console.log(`Testing access to webm file: ${filename}`);
      
      fetch(url, { method: 'HEAD' })
        .then(response => {
          console.log(`${filename} access:`, response.status, response.statusText);
          if (response.ok) {
            console.log(`${filename} Content-Type:`, response.headers.get('Content-Type'));
          }
        })
        .catch(error => {
          console.error(`${filename} access error:`, error);
        });
    });
  }
  
  debugAudio(event: Event, mediaPath?: string): void {
    if (!mediaPath) return;
    
    // Prevent event bubbling
    event.stopPropagation();
    event.preventDefault();
    
    // Find the audio element
    const button = event.target as HTMLElement;
    const voiceMessage = button.closest('.voice-message');
    const audioElement = voiceMessage?.querySelector('audio');
    
    if (!audioElement || !voiceMessage) return;
    
    // Create or update debug container
    let debugContainer = voiceMessage.querySelector('.audio-debug-container');
    if (!debugContainer) {
      debugContainer = document.createElement('div');
      debugContainer.className = 'audio-debug-container';
      voiceMessage.appendChild(debugContainer);
    }
    
    // Clear existing debug info
    debugContainer.innerHTML = '';
    
    // Get source element
    const sourceElement = audioElement.querySelector('source');
    
    // Add debug info
    const debugItems = [
      { label: 'File', value: mediaPath },
      { label: 'MIME Type', value: this.getContentType(mediaPath) },
      { label: 'URL', value: this.getMediaUrl(mediaPath) },
      { label: 'Network State', value: this.getNetworkStateText(audioElement.networkState) },
      { label: 'Ready State', value: this.getReadyStateText(audioElement.readyState) },
      { label: 'Error', value: audioElement.error ? `Code ${audioElement.error.code}: ${this.getErrorText(audioElement.error.code)}` : 'None' },
      { label: 'Source Type', value: sourceElement ? sourceElement.type : 'N/A' },
      { label: 'Source URL', value: sourceElement ? sourceElement.src : 'N/A' }
    ];
    
    // Render debug info
    debugItems.forEach(item => {
      const row = document.createElement('div');
      row.className = 'audio-debug-item';
      
      const label = document.createElement('div');
      label.className = 'audio-debug-label';
      label.textContent = item.label + ':';
      
      const value = document.createElement('div');
      value.className = 'audio-debug-value';
      value.textContent = item.value || 'N/A';
      
      row.appendChild(label);
      row.appendChild(value);
      debugContainer.appendChild(row);
    });
    
    // Add direct tests to debug container
    const testRow = document.createElement('div');
    testRow.className = 'audio-debug-item';
    testRow.innerHTML = '<div class="audio-debug-label">Status:</div><div class="audio-debug-value">Testing...</div>';
    debugContainer.appendChild(testRow);
    
    // Perform direct fetch test
    const mediaUrl = this.getMediaUrl(mediaPath);
    fetch(mediaUrl, { method: 'HEAD' })
      .then(response => {
        const statusValue = testRow.querySelector('.audio-debug-value') as HTMLElement;
        if (statusValue) {
          if (response.ok) {
            statusValue.textContent = `OK (${response.status}): ${response.headers.get('Content-Type') || 'unknown type'}`;
            statusValue.style.color = 'green';
          } else {
            statusValue.textContent = `Error (${response.status}): ${response.statusText}`;
            statusValue.style.color = 'red';
          }
        }
      })
      .catch(error => {
        const statusValue = testRow.querySelector('.audio-debug-value') as HTMLElement;
        if (statusValue) {
          statusValue.textContent = `Network Error: ${error.message}`;
          statusValue.style.color = 'red';
        }
      });
  }
  
  getNetworkStateText(state: number): string {
    switch(state) {
      case 0: return 'NETWORK_EMPTY (0)';
      case 1: return 'NETWORK_IDLE (1)';
      case 2: return 'NETWORK_LOADING (2)';
      case 3: return 'NETWORK_NO_SOURCE (3)';
      default: return `Unknown (${state})`;
    }
  }
  
  getReadyStateText(state: number): string {
    switch(state) {
      case 0: return 'HAVE_NOTHING (0)';
      case 1: return 'HAVE_METADATA (1)';
      case 2: return 'HAVE_CURRENT_DATA (2)';
      case 3: return 'HAVE_FUTURE_DATA (3)';
      case 4: return 'HAVE_ENOUGH_DATA (4)';
      default: return `Unknown (${state})`;
    }
  }
  
  getErrorText(code: number): string {
    switch(code) {
      case 1: return 'MEDIA_ERR_ABORTED';
      case 2: return 'MEDIA_ERR_NETWORK';
      case 3: return 'MEDIA_ERR_DECODE';
      case 4: return 'MEDIA_ERR_SRC_NOT_SUPPORTED';
      default: return `Unknown error (${code})`;
    }
  }
  
  playAudioDirectly(event: Event, mediaPath?: string): void {
    if (!mediaPath) return;
    
    // Prevent event bubbling
    event.stopPropagation();
    event.preventDefault();
    
    // Find closest voice message
    const button = event.target as HTMLElement;
    const voiceMessage = button.closest('.voice-message');
    if (!voiceMessage) return;
    
    // Show playing status
    const statusElement = document.createElement('div');
    statusElement.className = 'direct-play-status';
    statusElement.textContent = 'Loading audio...';
    statusElement.style.color = '#0066cc';
    statusElement.style.fontWeight = 'bold';
    statusElement.style.marginTop = '8px';
    statusElement.style.padding = '4px';
    statusElement.style.backgroundColor = '#f0f0f0';
    statusElement.style.borderRadius = '4px';
    statusElement.style.textAlign = 'center';
    
    // Add status to message container
    voiceMessage.appendChild(statusElement);
    
    // Get media URL
    const mediaUrl = this.getMediaUrl(mediaPath);
    console.log('Attempting to play audio directly:', mediaUrl);
    
    // Create audio object
    const audio = new Audio();
    
    // Setup event listeners
    audio.oncanplay = () => {
      statusElement.textContent = 'Playing audio...';
      audio.play()
        .then(() => {
          console.log('Direct audio playback started successfully');
        })
        .catch(error => {
          console.error('Error starting direct audio playback:', error);
          statusElement.textContent = `Error playing: ${error.message}`;
          statusElement.style.color = 'red';
        });
    };
    
    audio.onended = () => {
      statusElement.textContent = 'Playback complete';
      setTimeout(() => {
        if (statusElement.parentNode) {
          statusElement.parentNode.removeChild(statusElement);
        }
      }, 2000);
    };
    
    audio.onerror = (e) => {
      console.error('Direct audio playback error:', e);
      statusElement.textContent = `Playback error: ${this.getErrorText(audio.error?.code || 0)}`;
      statusElement.style.color = 'red';
    };
    
    // Add timestamp to avoid caching issues
    const timestamp = new Date().getTime();
    audio.src = `${mediaUrl}?t=${timestamp}`;
    audio.load();
  }
  
  async playViaBlob(event: Event, mediaPath?: string): Promise<void> {
    if (!mediaPath) return;
    
    // Prevent event bubbling
    event.stopPropagation();
    event.preventDefault();
    
    // Find closest voice message
    const button = event.target as HTMLElement;
    const voiceMessage = button.closest('.voice-message');
    if (!voiceMessage) return;
    
    // Show loading status
    const statusElement = document.createElement('div');
    statusElement.className = 'blob-play-status';
    statusElement.textContent = 'Fetching audio...';
    statusElement.style.color = '#0066cc';
    statusElement.style.fontWeight = 'bold';
    statusElement.style.marginTop = '8px';
    statusElement.style.padding = '4px';
    statusElement.style.backgroundColor = '#f0f0f0';
    statusElement.style.borderRadius = '4px';
    statusElement.style.textAlign = 'center';
    
    // Add status to message container
    voiceMessage.appendChild(statusElement);
    
    // Get media URL
    const mediaUrl = this.getMediaUrl(mediaPath);
    console.log('Attempting to play audio via blob URL:', mediaUrl);
    
    try {
      // Fetch the audio file as an array buffer
      const response = await fetch(mediaUrl, {
        method: 'GET',
        headers: {
          'Accept': 'audio/*'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      // Get content type for proper blob creation
      const contentType = response.headers.get('Content-Type') || this.getContentType(mediaPath);
      console.log('Server returned content type:', contentType);
      
      // Get the audio data
      const arrayBuffer = await response.arrayBuffer();
      console.log('Received array buffer size:', arrayBuffer.byteLength);
      
      // Create a blob from the data
      const blob = new Blob([arrayBuffer], { type: contentType });
      
      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);
      console.log('Created blob URL:', blobUrl);
      
      statusElement.textContent = 'Playing via blob URL...';
      
      // Create and play audio
      const audio = new Audio(blobUrl);
      audio.onended = () => {
        statusElement.textContent = 'Playback complete';
        // Clean up the blob URL
        URL.revokeObjectURL(blobUrl);
        
        setTimeout(() => {
          if (statusElement.parentNode) {
            statusElement.parentNode.removeChild(statusElement);
          }
        }, 2000);
      };
      
      audio.onerror = (e) => {
        console.error('Blob URL audio playback error:', e);
        statusElement.textContent = `Blob playback error: ${this.getErrorText(audio.error?.code || 0)}`;
        statusElement.style.color = 'red';
        URL.revokeObjectURL(blobUrl);
      };
      
      // Play the audio
      await audio.play();
      console.log('Blob URL audio playback started successfully');
      
    } catch (error) {
      console.error('Error in blob URL audio playback:', error);
      statusElement.textContent = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      statusElement.style.color = 'red';
    }
  }
  
  async diagnoseMediaIssues(event: Event, mediaPath?: string): Promise<void> {
    if (!mediaPath) return;
    
    // Prevent event bubbling
    event.stopPropagation();
    event.preventDefault();
    
    // Find closest voice message
    const button = event.target as HTMLElement;
    const voiceMessage = button.closest('.voice-message');
    if (!voiceMessage) return;
    
    // Create or get diagnosis container
    let diagnosisContainer = voiceMessage.querySelector('.diagnosis-container') as HTMLElement;
    if (!diagnosisContainer) {
      diagnosisContainer = document.createElement('div');
      diagnosisContainer.className = 'diagnosis-container';
      diagnosisContainer.style.backgroundColor = '#f9f9f9';
      diagnosisContainer.style.border = '1px solid #ddd';
      diagnosisContainer.style.borderRadius = '4px';
      diagnosisContainer.style.padding = '12px';
      diagnosisContainer.style.marginTop = '12px';
      diagnosisContainer.style.fontFamily = 'monospace';
      diagnosisContainer.style.fontSize = '12px';
      diagnosisContainer.style.whiteSpace = 'pre-wrap';
      diagnosisContainer.style.maxHeight = '300px';
      diagnosisContainer.style.overflowY = 'auto';
      voiceMessage.appendChild(diagnosisContainer);
    }
    
    // Clear existing content
    diagnosisContainer.innerHTML = '<h3 style="margin-top: 0">💊 Media Diagnosis</h3>';
    
    // Get the media URL
    const mediaUrl = this.getMediaUrl(mediaPath);
    
    // Add the file info
    this.addDiagnosisInfo(diagnosisContainer, '📄 File', mediaPath);
    this.addDiagnosisInfo(diagnosisContainer, '🔗 URL', mediaUrl);
    this.addDiagnosisInfo(diagnosisContainer, '📎 Type', this.getContentType(mediaPath));
    
    // Test 1: Simple HEAD request
    this.addDiagnosisInfo(diagnosisContainer, '🔍 Test #1', 'Sending HEAD request...', 'blue');
    try {
      const headResponse = await fetch(mediaUrl, { method: 'HEAD' });
      if (headResponse.ok) {
        const contentType = headResponse.headers.get('Content-Type');
        const contentLength = headResponse.headers.get('Content-Length');
        this.addDiagnosisInfo(
          diagnosisContainer, 
          '✅ HEAD Request', 
          `Success (${headResponse.status} ${headResponse.statusText})
           Content-Type: ${contentType || 'not specified'}
           Content-Length: ${contentLength || 'not specified'}`, 
          'green'
        );
      } else {
        this.addDiagnosisInfo(
          diagnosisContainer, 
          '❌ HEAD Request', 
          `Failed: ${headResponse.status} ${headResponse.statusText}`, 
          'red'
        );
      }
    } catch (error) {
      this.addDiagnosisInfo(
        diagnosisContainer, 
        '❌ HEAD Request', 
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        'red'
      );
    }
    
    // Test 2: GET request with range
    this.addDiagnosisInfo(diagnosisContainer, '🔍 Test #2', 'Sending GET request for first byte...', 'blue');
    try {
      const getResponse = await fetch(mediaUrl, { 
        method: 'GET',
        headers: {
          'Range': 'bytes=0-0',
          'Accept': 'audio/*, */*'
        }
      });
      
      if (getResponse.ok || getResponse.status === 206) {
        const contentType = getResponse.headers.get('Content-Type');
        const contentLength = getResponse.headers.get('Content-Length');
        const acceptRanges = getResponse.headers.get('Accept-Ranges');
        this.addDiagnosisInfo(
          diagnosisContainer, 
          '✅ GET Request', 
          `Success (${getResponse.status} ${getResponse.statusText})
           Content-Type: ${contentType || 'not specified'}
           Content-Length: ${contentLength || 'not specified'}
           Accept-Ranges: ${acceptRanges || 'not specified'}`, 
          'green'
        );
      } else {
        this.addDiagnosisInfo(
          diagnosisContainer, 
          '❌ GET Request', 
          `Failed: ${getResponse.status} ${getResponse.statusText}`, 
          'red'
        );
      }
    } catch (error) {
      this.addDiagnosisInfo(
        diagnosisContainer, 
        '❌ GET Request', 
        `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        'red'
      );
    }
    
    // Test 3: Check audio element support
    this.addDiagnosisInfo(diagnosisContainer, '🔍 Test #3', 'Testing browser audio support...', 'blue');
    const audio = document.createElement('audio');
    const canPlayType = audio.canPlayType(this.getContentType(mediaPath));
    this.addDiagnosisInfo(
      diagnosisContainer, 
      canPlayType ? '✅ Audio Format' : '⚠️ Audio Format', 
      `Browser ${canPlayType || 'might not'} support ${this.getContentType(mediaPath)}`, 
      canPlayType ? 'green' : 'orange'
    );
    
    // Test 4: Try XHR request for CORS issues
    this.addDiagnosisInfo(diagnosisContainer, '🔍 Test #4', 'Testing CORS with XMLHttpRequest...', 'blue');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', mediaUrl);
    
    // Add a promise wrapper for XHR
    const xhrPromise = new Promise<string>((resolve, reject) => {
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(`Success (${xhr.status} ${xhr.statusText})`);
        } else {
          reject(new Error(`XHR failed: ${xhr.status} ${xhr.statusText}`));
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('XHR encountered a network error'));
      };
    });
    
    try {
      const xhrResult = await xhrPromise;
      this.addDiagnosisInfo(diagnosisContainer, '✅ CORS Check', xhrResult, 'green');
    } catch (error) {
      this.addDiagnosisInfo(
        diagnosisContainer, 
        '❌ CORS Check', 
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        'red'
      );
    }
    
    // Test 5: Create audio element and try to load metadata
    this.addDiagnosisInfo(diagnosisContainer, '🔍 Test #5', 'Testing preload metadata...', 'blue');
    const testAudio = new Audio();
    testAudio.src = mediaUrl;
    testAudio.preload = 'metadata';
    
    const metadataPromise = new Promise<string>((resolve, reject) => {
      let timeoutId: any;
      
      testAudio.onloadedmetadata = function() {
        clearTimeout(timeoutId);
        resolve(`Success: Duration = ${testAudio.duration.toFixed(2)}s`);
      };
      
      testAudio.onerror = function() {
        clearTimeout(timeoutId);
        reject(new Error(`Error code: ${testAudio.error?.code || 'unknown'}`));
      };
      
      // Set timeout for metadata loading
      timeoutId = setTimeout(() => {
        reject(new Error('Timed out waiting for metadata'));
      }, 5000);
    });
    
    try {
      const metadataResult = await metadataPromise;
      this.addDiagnosisInfo(diagnosisContainer, '✅ Metadata Load', metadataResult, 'green');
    } catch (error) {
      this.addDiagnosisInfo(
        diagnosisContainer, 
        '❌ Metadata Load', 
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        'red'
      );
    }
    
    // Final summary
    this.addDiagnosisInfo(diagnosisContainer, '📊 Summary', 'Diagnosis complete', 'blue');
  }
  
  // Helper for diagnosis info
  private addDiagnosisInfo(container: HTMLElement, label: string, value: string, color: string = 'black'): void {
    const entry = document.createElement('div');
    entry.style.marginBottom = '8px';
    
    const labelSpan = document.createElement('span');
    labelSpan.textContent = `${label}: `;
    labelSpan.style.fontWeight = 'bold';
    
    const valueSpan = document.createElement('span');
    valueSpan.textContent = value;
    valueSpan.style.color = color;
    
    entry.appendChild(labelSpan);
    entry.appendChild(valueSpan);
    container.appendChild(entry);
  }
} 