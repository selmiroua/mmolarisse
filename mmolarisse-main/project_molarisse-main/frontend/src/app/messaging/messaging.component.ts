import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { ConversationListComponent } from './conversation-list/conversation-list.component';
import { ConversationDetailComponent } from './conversation-detail/conversation-detail.component';
import { UserSearchComponent } from './user-search/user-search.component';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTabsModule,
    ConversationListComponent,
    ConversationDetailComponent,
    UserSearchComponent
  ],
  template: `
    <div class="messaging-container">
      <div class="messaging-layout">
        <!-- Left side - Conversations and User Search -->
        <div class="conversation-sidebar">
          <mat-tab-group>
            <mat-tab label="Conversations">
              <app-conversation-list (click)="onConversationListClick($event)"></app-conversation-list>
            </mat-tab>
            <mat-tab label="Collègues">
              <app-user-search (conversationStarted)="onConversationStarted($event)"></app-user-search>
            </mat-tab>
          </mat-tab-group>
        </div>
        
        <!-- Right side - Conversation Detail -->
        <div class="conversation-detail">
          <div *ngIf="!selectedUserId" class="empty-conversation">
            <div class="empty-state">
              <mat-icon>chat</mat-icon>
              <p>Sélectionnez une conversation pour commencer à discuter</p>
            </div>
          </div>
          
          <div *ngIf="selectedUserId" class="conversation-detail-container">
            <app-conversation-detail [userId]="selectedUserId"></app-conversation-detail>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .messaging-container {
      height: 100%;
      overflow: hidden;
    }
    
    .messaging-layout {
      height: 100%;
      display: flex;
    }
    
    .conversation-sidebar {
      width: 320px;
      border-right: 1px solid #e0e0e0;
      overflow: hidden;
      flex-shrink: 0;
    }
    
    ::ng-deep .conversation-sidebar .mat-tab-body-wrapper {
      height: calc(100vh - 112px);
      overflow: auto;
    }
    
    .conversation-detail {
      flex-grow: 1;
      height: 100%;
      overflow: hidden;
      position: relative;
    }
    
    .empty-conversation {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f9f9f9;
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 20px;
    }
    
    .empty-state mat-icon {
      font-size: 64px;
      height: 64px;
      width: 64px;
      margin-bottom: 20px;
      color: #cccccc;
    }
    
    .empty-state p {
      color: #757575;
      font-size: 18px;
      margin: 0;
    }
    
    .conversation-detail-container {
      height: 100%;
    }
    
    @media (max-width: 768px) {
      .messaging-layout {
        flex-direction: column;
      }
      
      .conversation-sidebar {
        width: 100%;
        height: 300px;
        border-right: none;
        border-bottom: 1px solid #e0e0e0;
      }
      
      ::ng-deep .conversation-sidebar .mat-tab-body-wrapper {
        height: calc(300px - 48px);
      }
    }
  `]
})
export class MessagingComponent implements OnInit {
  selectedUserId: number | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Subscribe to route changes to update the selected conversation
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.selectedUserId = parseInt(idParam, 10);
      }
    });
  }
  
  // Handle conversation selection from UserSearchComponent
  onConversationStarted(userId: number): void {
    this.selectedUserId = userId;
  }
  
  // Handle click events on conversation list
  onConversationListClick(event: MouseEvent): void {
    // Find the closest element with data-partner-id attribute
    const target = event.target as HTMLElement;
    const conversationItem = target.closest('[data-partner-id]');
    
    if (conversationItem) {
      const partnerId = conversationItem.getAttribute('data-partner-id');
      if (partnerId) {
        this.selectedUserId = parseInt(partnerId, 10);
        event.preventDefault();
      }
    }
  }
} 