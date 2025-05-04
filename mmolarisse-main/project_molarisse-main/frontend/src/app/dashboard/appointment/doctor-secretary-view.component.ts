import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentService, Appointment, AppointmentStatus } from '../../core/services/appointment.service';
import { DatePipe } from '@angular/common';
import { retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-doctor-secretary-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatMenuModule,
    MatCardModule,
    MatProgressSpinnerModule,
    HttpClientModule
  ],
  template: `
    <div class="view-container">
      <!-- Title header with refresh button -->
      <div class="title-container">
        <h1 class="view-title">Gestion des Rendez-vous</h1>
        <button mat-raised-button color="primary" class="refresh-button" (click)="loadAppointments()">
          <mat-icon>refresh</mat-icon>
          Actualiser
        </button>
      </div>
      
      <!-- Filter tabs -->
      <div class="tabs-container">
        <div class="tab-group">
          <button 
            class="tab-button" 
            [class.active]="activeTab === 'upcoming'"
            (click)="activeTab = 'upcoming'"
          >
            À Venir <span class="badge" *ngIf="upcomingAppointments.length > 0">{{ upcomingAppointments.length }}</span>
          </button>
          
          <button 
            class="tab-button" 
            [class.active]="activeTab === 'cancelled'"
            (click)="activeTab = 'cancelled'"
          >
            Annulés <span class="badge warn" *ngIf="cancelledAppointments.length > 0">{{ cancelledAppointments.length }}</span>
          </button>
          
          <button 
            class="tab-button" 
            [class.active]="activeTab === 'completed'"
            (click)="activeTab = 'completed'"
          >
            Terminés <span class="badge success" *ngIf="completedAppointments.length > 0">{{ completedAppointments.length }}</span>
          </button>
        </div>
        
        <!-- Date range and filter buttons -->
        <div class="filter-controls">
          <button mat-button class="filter-btn date-range">
            <mat-icon>date_range</mat-icon>
            28/04/2025 - 04/05/2025
          </button>
          <button mat-button class="filter-btn">
            <span>Filtrer Par</span>
            <mat-icon>keyboard_arrow_down</mat-icon>
          </button>
        </div>
      </div>
      
      <!-- Loading state -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Chargement des rendez-vous...</p>
      </div>
      
      <!-- Empty state -->
      <div *ngIf="!loading && getFilteredAppointments().length === 0" class="empty-state">
        <p>Aucun rendez-vous {{ activeTab === 'upcoming' ? 'à venir' : activeTab === 'cancelled' ? 'annulé' : 'terminé' }} trouvé.</p>
      </div>
      
      <!-- Appointment cards -->
      <div *ngIf="!loading && getFilteredAppointments().length > 0" class="appointments-list">
        <div *ngFor="let appointment of getFilteredAppointments()" class="appointment-card">
          <!-- Avatar and patient info -->
          <div class="patient-section">
            <div class="avatar">
              {{ getPatientInitials(appointment.patient) }}
            </div>
            <div class="patient-info">
              <div class="appointment-id">#Apt{{ padNumber(appointment.id, 4) }}</div>
              <div class="patient-name">{{ appointment.patient?.prenom }} {{ appointment.patient?.nom }}</div>
            </div>
          </div>
          
          <!-- Appointment details -->
          <div class="appointment-details">
            <div class="datetime">
              <mat-icon>event</mat-icon>
              {{ formatDate(appointment.appointmentDateTime) }}
            </div>
            <div class="type">
              {{ getTypeDisplay(appointment.appointmentType) }} • {{ getAppointmentTypeLabel(appointment.caseType) }}
            </div>
          </div>
          
          <!-- Contact info -->
          <div class="contact-info">
            <div class="email" *ngIf="appointment.patient?.email">
              <mat-icon>email</mat-icon>
              {{ appointment.patient?.email }}
            </div>
            <div class="phone" *ngIf="appointment.patient?.phoneNumber">
              <mat-icon>phone</mat-icon>
              {{ appointment.patient?.phoneNumber || 'N/A' }}
            </div>
          </div>
          
          <!-- Action buttons -->
          <div class="action-buttons">
            <button mat-icon-button matTooltip="Voir détails">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Message">
              <mat-icon>chat</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Paramètres">
              <mat-icon>settings</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Profil du patient">
              <mat-icon>person</mat-icon>
            </button>
            
            <button mat-raised-button color="primary" class="start-button">
              {{ activeTab === 'upcoming' ? 'Commencer' : activeTab === 'completed' ? 'Replanifier' : 'Reprendre RDV' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .view-container {
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    
    .title-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .view-title {
      font-size: 1.75rem;
      font-weight: 500;
      margin-bottom: 0;
      color: #333;
    }
    
    .refresh-button {
      border-radius: 30px;
    }
    
    .tabs-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .tab-group {
      display: flex;
      gap: 10px;
    }
    
    .tab-button {
      background: #f5f5f5;
      border: none;
      padding: 8px 20px;
      cursor: pointer;
      font-weight: 500;
      color: #666;
      display: flex;
      align-items: center;
      position: relative;
      transition: all 0.2s ease;
      border-radius: 30px;
    }
    
    .tab-button.active {
      background: #007bff;
      color: white;
    }
    
    .badge {
      background: #007bff;
      color: white;
      border-radius: 50%;
      min-width: 22px;
      height: 22px;
      padding: 0 6px;
      font-size: 12px;
      margin-left: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .badge.warn {
      background: #dc3545;
    }
    
    .badge.success {
      background: #28a745;
    }
    
    .filter-controls {
      display: flex;
      gap: 10px;
    }
    
    .filter-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      padding: 5px 15px;
      color: #007bff;
    }
    
    .date-range {
      min-width: 180px;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 50px 0;
    }
    
    .loading-container p {
      margin-top: 20px;
      color: #666;
    }
    
    .empty-state {
      text-align: center;
      padding: 50px 0;
      color: #666;
    }
    
    .appointments-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .appointment-card {
      border: 1px solid #eaeaea;
      border-radius: 10px;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s ease;
    }
    
    .appointment-card:hover {
      box-shadow: 0 5px 15px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }
    
    .patient-section {
      display: flex;
      align-items: center;
      gap: 15px;
      width: 22%;
    }
    
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #e6f7fd;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2196F3;
      font-weight: bold;
      font-size: 18px;
      border: 2px solid #bbdefb;
    }
    
    .appointment-id {
      color: #2196F3;
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    .patient-name {
      font-weight: bold;
      font-size: 16px;
    }
    
    .appointment-details {
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 22%;
    }
    
    .datetime {
      display: flex;
      align-items: center;
      gap: 5px;
      font-weight: 500;
    }
    
    .type {
      color: #666;
      font-size: 14px;
    }
    
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 25%;
    }
    
    .email, .phone {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #666;
      font-size: 14px;
    }
    
    .action-buttons {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .start-button {
      margin-left: 10px;
      border-radius: 20px;
      min-width: 120px;
    }
    
    @media (max-width: 1200px) {
      .appointment-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
      
      .patient-section, .appointment-details, .contact-info {
        width: 100%;
      }
      
      .action-buttons {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `],
  providers: [DatePipe]
})
export class DoctorSecretaryViewComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  activeTab = 'upcoming';
  apiUrl = environment.apiUrl;
  AppointmentStatus = AppointmentStatus;

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }
  
  loadAppointments(): void {
    this.loading = true;
    console.log('Doctor secretary view: Loading appointments...');
    this.appointmentService.getMyDoctorAppointments().pipe(
      retry(3) // Retry up to 3 times
    ).subscribe({
      next: (appointments) => {
        console.log('Doctor secretary view: Received appointments:', appointments);
        this.appointments = appointments;
        this.loading = false;
      },
      error: (error) => {
        console.error('Doctor secretary view: Error loading appointments:', error);
        this.snackBar.open(error.message || 'Échec du chargement des rendez-vous', 'Fermer', {
          duration: 3000
        });
        this.loading = false;
        // In case of error, set empty array to prevent UI issues
        this.appointments = [];
      }
    });
  }
  
  get upcomingAppointments(): Appointment[] {
    return this.appointments.filter(apt => 
      apt.status === AppointmentStatus.PENDING || 
      apt.status === AppointmentStatus.ACCEPTED
    );
  }
  
  get cancelledAppointments(): Appointment[] {
    return this.appointments.filter(apt => 
      apt.status === AppointmentStatus.CANCELED || 
      apt.status === AppointmentStatus.REJECTED
    );
  }
  
  get completedAppointments(): Appointment[] {
    return this.appointments.filter(apt => 
      apt.status === AppointmentStatus.COMPLETED
    );
  }
  
  getFilteredAppointments(): Appointment[] {
    switch (this.activeTab) {
      case 'upcoming':
        return this.upcomingAppointments;
      case 'cancelled':
        return this.cancelledAppointments;
      case 'completed':
        return this.completedAppointments;
      default:
        return this.appointments;
    }
  }
  
  updateStatus(appointmentId: number, status: AppointmentStatus): void {
    this.appointmentService.updateMyAppointmentStatus(appointmentId, status).subscribe({
      next: (updatedAppointment) => {
        const index = this.appointments.findIndex(a => a.id === appointmentId);
        if (index !== -1) {
          this.appointments[index] = updatedAppointment;
        }
        this.snackBar.open('Statut du rendez-vous mis à jour avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut du rendez-vous:', error);
        this.snackBar.open(error.message || 'Échec de la mise à jour du statut du rendez-vous', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  // Helper methods for formatting and display
  getPatientInitials(patient: any): string {
    if (!patient || (!patient.prenom && !patient.nom)) {
      return '?';
    }
    
    const first = patient.prenom ? patient.prenom.charAt(0).toUpperCase() : '';
    const last = patient.nom ? patient.nom.charAt(0).toUpperCase() : '';
    
    return first + last;
  }
  
  padNumber(num: number, size: number): string {
    let s = num.toString();
    while (s.length < size) s = '0' + s;
    return s;
  }
  
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('fr-FR', { month: 'short' });
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours.toString().padStart(2, '0');
      
      return `${day} ${month} ${year} ${formattedHours}.${minutes} ${ampm}`;
    } catch (e) {
      return dateString;
    }
  }
  
  // Helper methods for labels in French
  getTypeDisplay(type: string): string {
    return this.getAppointmentTypeLabel(type);
  }
  
  getAppointmentTypeLabel(type: string): string {
    switch (type) {
      case 'DETARTRAGE': return 'Détartrage';
      case 'SOIN': return 'Soin';
      case 'EXTRACTION': return 'Extraction';
      case 'BLANCHIMENT': return 'Blanchiment';
      case 'ORTHODONTIE': return 'Orthodontie';
      case 'URGENT': return 'Urgent';
      case 'CONTROL': return 'Contrôle';
      case 'NORMAL': return 'Normal';
      default: return type;
    }
  }
} 