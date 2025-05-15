import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DoctorVerification } from '../../core/models/doctor-verification.model';
import { environment } from '../../../environments/environment';
import { PdfViewerComponent } from '../../shared/components/pdf-viewer.component';

@Component({
  selector: 'app-doctor-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    PdfViewerComponent
  ],
  template: `
    <div class="doctor-detail-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title>Détails de la demande de vérification</h2>
        <button mat-icon-button mat-dialog-close>
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <mat-dialog-content>
        <div class="doctor-profile">
          <div class="doctor-header">
            <div class="doctor-avatar">
              <div class="avatar-placeholder">
                <mat-icon>person</mat-icon>
              </div>
            </div>
            <div class="doctor-basic-info">
              <h3>Dr. ID: {{ verification.doctorId }}</h3>
              <p class="email">{{ verification.email }}</p>
              <p class="phone">{{ verification.phoneNumber || 'Aucun numéro' }}</p>
              <div class="status-badge" [ngClass]="verification.status">
                {{ getStatusLabel(verification.status) }}
              </div>
            </div>
          </div>
          
          <div class="info-section">
            <h4>Informations professionnelles</h4>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Cabinet</div>
                <div class="info-value">{{ verification.cabinetName || 'Non spécifié' }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Adresse du cabinet</div>
                <div class="info-value">{{ verification.cabinetAddress || 'Non spécifiée' }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Code postal</div>
                <div class="info-value">{{ verification.postalCode || 'Non spécifié' }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Adresse personnelle</div>
                <div class="info-value">{{ verification.address || 'Non spécifiée' }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Années d'expérience</div>
                <div class="info-value">{{ verification.yearsOfExperience || '0' }} ans</div>
              </div>
              <div class="info-item full-width">
                <div class="info-label">Spécialités</div>
                <div class="info-value specialties">
                  <span *ngFor="let specialty of verification.specialties" class="specialty-chip">
                    {{ specialty }}
                  </span>
                  <span *ngIf="!verification.specialties || verification.specialties.length === 0">
                    Aucune spécialité spécifiée
                  </span>
                </div>
              </div>
              <div class="info-item full-width" *ngIf="verification.message">
                <div class="info-label">Message</div>
                <div class="info-value message">{{ verification.message }}</div>
              </div>
            </div>
          </div>
          
          <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="center" class="document-tabs">
            <mat-tab label="Photo du cabinet" *ngIf="verification.cabinetPhotoPath">
              <div class="document-container">
                <ng-container *ngIf="!isPdf(verification.cabinetPhotoPath)">
                  <ng-container *ngIf="imageLoaded.cabinet; else cabinetPlaceholder">
                    <img [src]="getDocumentUrl(verification.cabinetPhotoPath)" 
                         alt="Photo du cabinet" 
                         class="document-image" 
                         (error)="handleImageError($event, 'cabinet')"
                         (load)="onImageLoad('cabinet')">
                  </ng-container>
                  <ng-template #cabinetPlaceholder>
                    <div class="image-placeholder full-size">
                      <mat-icon>image_not_supported</mat-icon>
                      <span>Image non disponible</span>
                    </div>
                  </ng-template>
                </ng-container>
                <app-pdf-viewer *ngIf="isPdf(verification.cabinetPhotoPath)" [pdfUrl]="getDocumentUrl(verification.cabinetPhotoPath)"></app-pdf-viewer>
              </div>
            </mat-tab>
            <mat-tab label="Diplôme" *ngIf="verification.diplomaPhotoPath">
              <div class="document-container">
                <ng-container *ngIf="!isPdf(verification.diplomaPhotoPath)">
                  <ng-container *ngIf="imageLoaded.diploma; else diplomaPlaceholder">
                    <img [src]="getDocumentUrl(verification.diplomaPhotoPath)" 
                         alt="Diplôme" 
                         class="document-image" 
                         (error)="handleImageError($event, 'diploma')"
                         (load)="onImageLoad('diploma')">
                  </ng-container>
                  <ng-template #diplomaPlaceholder>
                    <div class="image-placeholder full-size">
                      <mat-icon>image_not_supported</mat-icon>
                      <span>Image non disponible</span>
                    </div>
                  </ng-template>
                </ng-container>
                <app-pdf-viewer *ngIf="isPdf(verification.diplomaPhotoPath)" [pdfUrl]="getDocumentUrl(verification.diplomaPhotoPath)"></app-pdf-viewer>
              </div>
            </mat-tab>
          </mat-tab-group>
          
          <div class="no-documents" *ngIf="!verification.cabinetPhotoPath && !verification.diplomaPhotoPath">
            <mat-icon>no_photography</mat-icon>
            <p>Aucun document disponible</p>
          </div>
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Fermer</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .doctor-detail-dialog {
      max-width: 800px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }
    
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      
      h2 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.5rem;
      }
    }
    
    mat-dialog-content {
      flex: 1;
      overflow-y: auto;
      max-height: calc(90vh - 140px);
    }
    
    .doctor-profile {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .doctor-header {
      display: flex;
      gap: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .doctor-avatar {
      .avatar-placeholder {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: center;
        
        mat-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          color: #94a3b8;
        }
      }
    }
    
    .doctor-basic-info {
      flex: 1;
      position: relative;
      
      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        color: #2c3e50;
      }
      
      .email, .phone {
        margin: 0.25rem 0;
        color: #64748b;
        font-size: 0.9rem;
      }
      
      .status-badge {
        position: absolute;
        top: 0;
        right: 0;
        padding: 0.35rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 500;
        
        &.pending {
          background-color: #fff3cd;
          color: #856404;
        }
        
        &.approved {
          background-color: #d1e7dd;
          color: #0f5132;
        }
        
        &.rejected {
          background-color: #f8d7da;
          color: #842029;
        }
      }
    }
    
    .info-section {
      h4 {
        margin: 0 0 1rem 0;
        color: #334155;
        font-size: 1.1rem;
        font-weight: 500;
      }
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
      
      .info-item {
        &.full-width {
          grid-column: 1 / -1;
        }
        
        .info-label {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }
        
        .info-value {
          color: #1e293b;
          font-size: 0.95rem;
          
          &.specialties {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            
            .specialty-chip {
              background-color: #e2e8f0;
              color: #334155;
              padding: 0.25rem 0.75rem;
              border-radius: 16px;
              font-size: 0.8rem;
            }
          }
          
          &.message {
            background-color: #f8fafc;
            padding: 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.9rem;
            line-height: 1.5;
          }
        }
      }
    }
    
    .document-tabs {
      margin-top: 1rem;
    }
    
    .document-container {
      padding: 1.5rem;
      display: flex;
      justify-content: center;
      
      .document-image {
        max-width: 100%;
        max-height: 400px;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
    }
    
    .no-documents {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      background-color: #f8fafc;
      border-radius: 0.5rem;
      
      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #94a3b8;
        margin-bottom: 1rem;
      }
      
      p {
        color: #64748b;
        margin: 0;
      }
    }
  `]
})
export class DoctorDetailDialogComponent {
  imageLoaded = {
    cabinet: true,
    diploma: true
  };
  
  constructor(
    public dialogRef: MatDialogRef<DoctorDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public verification: DoctorVerification
  ) {}
  
  getStatusLabel(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Refusé';
      default: return status;
    }
  }
  
  getDocumentUrl(path: string): string {
    if (!path) return 'assets/images/image-not-available.png';
    
    // Get the base URL without any API path
    const baseUrl = environment.apiUrl; // e.g. "http://localhost:8080"
    
    // Add authorization token to the URL as a query parameter
    const token = this.getAuthToken();
    const authParam = token ? `?token=${encodeURIComponent(token)}` : '';
    
    // Log for debugging
    console.log(`Building URL for path: ${path}`);
    
    // Create the full document URL
    let documentUrl;
    
    // Check if the path already includes the full structure
    if (path.includes('/')) {
      // It already has a directory structure, use as is
      documentUrl = `${baseUrl}/api/v1/api/users/documents/${path}${authParam}`;
    } 
    // Check file extension to determine document type
    else if (path.endsWith('.jpg') || path.endsWith('.jpeg') || path.endsWith('.png')) {
      // It's a cabinet photo
      documentUrl = `${baseUrl}/api/v1/api/users/documents/cabinet_photos/${path}${authParam}`;
    } 
    else if (path.endsWith('.pdf')) {
      // It's a diploma document
      documentUrl = `${baseUrl}/api/v1/api/users/documents/diploma_docs/${path}${authParam}`;
    } 
    else {
      // Default case
      documentUrl = `${baseUrl}/api/v1/api/users/documents/${path}${authParam}`;
    }
    
    console.log(`Final document URL: ${documentUrl}`);
    return documentUrl;
  }
  
  private getAuthToken(): string | null {
    // Try to get the token from localStorage with multiple possible keys
    let token = localStorage.getItem('access_token');
    
    if (!token) {
      token = localStorage.getItem('auth_token');
    }
    
    if (!token) {
      token = localStorage.getItem('token');
    }
    
    if (!token) {
      // Log this for troubleshooting
      console.error('No authentication token found in localStorage');
    } else {
      console.log('Found token:', token.substring(0, 20) + '...');
    }
    
    return token;
  }
  
  onImageLoad(type: 'cabinet' | 'diploma'): void {
    this.imageLoaded[type] = true;
  }
  
  handleImageError(event: any, type: 'cabinet' | 'diploma'): void {
    console.log(`Image loading error for ${type}:`, event);
    this.imageLoaded[type] = false;
    event.target.style.display = 'none';
  }
  
  isPdf(path: string): boolean {
    return path ? path.toLowerCase().endsWith('.pdf') : false;
  }
} 