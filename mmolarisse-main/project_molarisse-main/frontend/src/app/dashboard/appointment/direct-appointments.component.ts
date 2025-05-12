import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { AppointmentService, Appointment, AppointmentStatus } from '../../core/services/appointment.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-direct-appointments',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatBadgeModule
  ],
  template: `
    <div class="appointments-container">
      <div class="header">
        <h1>Gestion des Rendez-vous</h1>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="loadAppointments()">
            <mat-icon>refresh</mat-icon> Actualiser
          </button>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="tabs-container">
        <div class="tab-group">
          <button 
            class="tab-button" 
            [class.active]="activeTab === 'upcoming'"
            (click)="activeTab = 'upcoming'"
          >
            À Venir
            <span class="badge" *ngIf="upcomingAppointments.length > 0">{{ upcomingAppointments.length }}</span>
          </button>
          
          <button 
            class="tab-button" 
            [class.active]="activeTab === 'cancelled'"
            (click)="activeTab = 'cancelled'"
          >
            Annulés
            <span class="badge warn" *ngIf="cancelledAppointments.length > 0">{{ cancelledAppointments.length }}</span>
          </button>
          
          <button 
            class="tab-button" 
            [class.active]="activeTab === 'completed'"
            (click)="activeTab = 'completed'"
          >
            Terminés
            <span class="badge success" *ngIf="completedAppointments.length > 0">{{ completedAppointments.length }}</span>
          </button>
        </div>
        
        <!-- Filter controls -->
        <div class="filter-controls">
          <button mat-button color="primary">
            <mat-icon>date_range</mat-icon> 28/04/2025 - 04/05/2025
          </button>
          <button mat-button color="primary">
            <mat-icon>filter_list</mat-icon> Filtrer Par
          </button>
        </div>
      </div>
      
      <!-- Loading spinner -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Chargement des rendez-vous...</p>
      </div>
      
      <!-- No data message -->
      <div *ngIf="!loading && getFilteredAppointments().length === 0" class="no-data">
        <p>Aucun rendez-vous {{ activeTab === 'upcoming' ? 'à venir' : activeTab === 'cancelled' ? 'annulé' : 'terminé' }} trouvé.</p>
      </div>
      
      <!-- Appointment cards -->
      <div *ngIf="!loading && getFilteredAppointments().length > 0" class="appointments-list">
        <div *ngFor="let appointment of getFilteredAppointments()" class="appointment-card">
          <!-- Patient info -->
          <div class="patient-info">
            <div class="avatar" [ngClass]="{
              'avatar-male': appointment.patient?.gender === 'MALE',
              'avatar-female': appointment.patient?.gender === 'FEMALE'
            }">
              <img [src]="getPatientAvatar(appointment.patient)" 
                   [alt]="getInitials(appointment.patient?.prenom, appointment.patient?.nom)"
                   (error)="handleImageError($event)">
            </div>
            <div class="details">
              <div class="appointment-id">#Apt{{ padNumber(appointment.id, 4) }}</div>
              <div class="patient-name">{{ appointment.patient?.prenom }} {{ appointment.patient?.nom }}</div>
            </div>
          </div>
          
          <!-- Appointment details -->
          <div class="appointment-info">
            <div class="datetime">
              <mat-icon>event</mat-icon>
              {{ formatDate(appointment.appointmentDateTime) }}
            </div>
            <div class="visit-type">
              {{ getAppointmentTypeDisplay(appointment) }}
            </div>
          </div>
          
          <!-- Contact info -->
          <div class="contact-info">
            <div class="email">
              <mat-icon>email</mat-icon>
              {{ getPatientEmail(appointment.patient) }}
            </div>
            <div class="phone">
              <mat-icon>phone</mat-icon>
              {{ formatPhoneNumber(appointment.patient?.phoneNumber) }}
            </div>
          </div>
          
          <!-- Actions -->
          <div class="action-buttons">
            <button mat-icon-button color="primary" title="Voir détails">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button color="primary" title="Message">
              <mat-icon>chat</mat-icon>
            </button>
            <button mat-icon-button color="primary" title="Gérer">
              <mat-icon>settings</mat-icon>
            </button>
            <button mat-icon-button color="primary" title="Profil du patient" (click)="viewPatientProfile(appointment.patient)">
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
    .appointments-container {
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .header h1 {
      font-size: 24px;
      color: #333;
      margin: 0;
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
      gap: 5px;
      margin-bottom: 10px;
    }
    
    .tab-button {
      background: #f5f5f5;
      border: none;
      padding: 10px 20px;
      border-radius: 30px;
      cursor: pointer;
      font-weight: 500;
      color: #666;
      display: flex;
      align-items: center;
      position: relative;
      transition: all 0.2s ease;
    }
    
    .tab-button.active {
      background: #007bff;
      color: white;
    }
    
    .badge {
      background: #007bff;
      color: white;
      border-radius: 10px;
      padding: 2px 8px;
      font-size: 12px;
      margin-left: 8px;
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
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 0;
    }
    
    .no-data {
      text-align: center;
      padding: 40px 0;
      color: #666;
    }
    
    .appointments-list {
      display: flex;
      flex-direction: column;
      gap:
      15px;
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
    
    .patient-info {
      display: flex;
      align-items: center;
      gap: 15px;
      width: 22%;
    }
    
    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #007bff;
      font-weight: bold;
      font-size: 18px;
      overflow: hidden;
      position: relative;
      border: 2px solid #e6f7ff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    
    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    
    .avatar-male {
      background: #e6f7ff;
      border-color: #007bff;
    }
    
    .avatar-female {
      background: #ffeef6;
      border-color: #ff69b4;
    }
    
    .initials {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: #f0f0f0;
      color: #666;
      font-weight: bold;
      font-size: 18px;
      text-transform: uppercase;
    }
    
    .initials-male {
      background: #e6f7ff;
      color: #007bff;
    }
    
    .initials-female {
      background: #ffeef6;
      color: #ff69b4;
    }
    
    .appointment-id {
      color: #007bff;
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    .patient-name {
      font-weight: bold;
      font-size: 16px;
    }
    
    .appointment-info {
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
    
    .visit-type {
      color: #666;
      font-size: 14px;
    }
    
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 30%;
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
    }
    
    @media (max-width: 1200px) {
      .appointment-card {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
      
      .patient-info, .appointment-info, .contact-info {
        width: 100%;
      }
      
      .action-buttons {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class DirectAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  loading = true;
  activeTab = 'upcoming';
  apiUrl = environment.apiUrl;
  
  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.loadAppointments();
  }
  
  loadAppointments(): void {
    this.loading = true;
    
    this.appointmentService.getMySecretaryAppointments().subscribe({
      next: (appointments) => {
        // Add a small display delay to make sure avatar images load correctly
        this.appointments = appointments;
        this.loading = false;
      },
      error: (error) => {
        console.error('DirectAppointmentsComponent: Erreur lors du chargement des rendez-vous', error);
        this.snackBar.open('Erreur lors du chargement des rendez-vous', 'Fermer', {
          duration: 3000
        });
        this.loading = false;
        this.appointments = [];
      }
    });
  }
  
  updateStatus(appointmentId: number, status: string): void {
    console.log(`DirectAppointmentsComponent: Updating appointment ${appointmentId} to status ${status}`);
    
    this.appointmentService.updateAppointmentStatus(appointmentId, status as AppointmentStatus).subscribe({
      next: () => {
        console.log('DirectAppointmentsComponent: Status updated successfully');
        this.snackBar.open('Statut du rendez-vous mis à jour', 'OK', {
          duration: 2000
        });
        this.loadAppointments(); // Reload the list
      },
      error: (error) => {
        console.error('DirectAppointmentsComponent: Error updating status', error);
        this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', {
          duration: 3000
        });
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
  
  getInitials(firstName?: string, lastName?: string): string {
    if (!firstName && !lastName) return 'U';
    
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    
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
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = (hours % 12) || 12;
      
      return `${day} ${month} ${year} ${formattedHours}.${minutes} ${ampm}`;
    } catch (e) {
      return dateString;
    }
  }
  
  formatPhoneNumber(phone?: string): string {
    if (!phone) {
      return 'N/A';
    }
    
    // Clean the phone number, keep only digits
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Apply different formatting based on length and region patterns
    if (digitsOnly.length === 10) { // US/Canada format
      return `+1 ${digitsOnly.substring(0, 3)} ${digitsOnly.substring(3, 6)} ${digitsOnly.substring(6, 10)}`;
    } else if (digitsOnly.length === 8) { // Some local formats
      return `${digitsOnly.substring(0, 2)} ${digitsOnly.substring(2, 5)} ${digitsOnly.substring(5, 8)}`;
    } else if (digitsOnly.length > 10) { // International format
      return `+${digitsOnly.substring(0, digitsOnly.length-9)} ${digitsOnly.substring(digitsOnly.length-9, digitsOnly.length-6)} ${digitsOnly.substring(digitsOnly.length-6, digitsOnly.length-3)} ${digitsOnly.substring(digitsOnly.length-3)}`;
    } else {
      // If format is not standard, just add spaces for readability
      let formatted = '';
      for (let i = 0; i < digitsOnly.length; i++) {
        if (i > 0 && i % 3 === 0) {
          formatted += ' ';
        }
        formatted += digitsOnly[i];
      }
      return formatted || phone;
    }
  }
  
  getPatientEmail(patient: any): string {
    if (!patient) return 'N/A';
    
    // Try different possible email field names
    return patient.email || patient.emailAddress || patient.mail || 'N/A';
  }
  
  getPatientAvatar(patient: any): string {
    if (!patient) {
      return this.getDefaultAvatar('?');
    }
    
    // If patient has a profile picture path, use it directly
    if (patient.profilePicturePath && patient.profilePicturePath.trim() !== '') {
      // Add timestamp to prevent caching issues
      const timestamp = new Date().getTime();
      return `${this.apiUrl}/api/v1/api/users/profile/picture/${patient.profilePicturePath}?t=${timestamp}`;
    }
    
    // If no profile picture, generate avatar based on initials
    const initials = this.getInitials(patient.prenom, patient.nom);
    const background = patient.gender === 'MALE' ? '007bff' : patient.gender === 'FEMALE' ? 'ff69b4' : '666666';
    return this.getDefaultAvatar(initials, background);
  }
  
  /**
   * Get a generated avatar from UI Avatars service
   */
  getDefaultAvatar(initials: string, background: string = '666666'): string {
    // Ensure initials are properly encoded for URL
    const encodedInitials = encodeURIComponent(initials || '?');
    return `https://ui-avatars.com/api/?name=${encodedInitials}&background=${background}&color=fff&size=128&bold=true`;
  }
  
  hasProfileImage(patient: any): boolean {
    return patient && patient.profilePicturePath && patient.profilePicturePath.trim() !== '';
  }
  
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    const originalSrc = imgElement.src;
    
    // Get the patient data from the parent elements
    const cardElement = imgElement.closest('.appointment-card');
    let gender = '';
    let initials = '?';
    let patientId = null;
    
    if (cardElement) {
      // Try to find patient info
      const appointmentIndex = Array.from(document.querySelectorAll('.appointment-card')).indexOf(cardElement as HTMLElement);
      if (appointmentIndex >= 0) {
        const appointment = this.getFilteredAppointments()[appointmentIndex];
        if (appointment?.patient) {
          gender = appointment.patient.gender || '';
          initials = this.getInitials(appointment.patient.prenom, appointment.patient.nom);
          patientId = appointment.patient.id;
          
          // Try alternative URL patterns if this is the first error
          if (!imgElement.getAttribute('data-retry-count')) {
            imgElement.setAttribute('data-retry-count', '1');
            
            // Try direct patient ID approach
            if (patientId && originalSrc.includes('/api/v1/api/users/profile/picture/')) {
              const timestamp = new Date().getTime();
              // Try with user_ prefix
              imgElement.src = `${this.apiUrl}/api/v1/api/users/profile/picture/user_${patientId}?t=${timestamp}`;
              return;
            }
          }
          // If we've already tried alternate URLs, move to the fallback
          else if (imgElement.getAttribute('data-retry-count') === '1' && patientId) {
            imgElement.setAttribute('data-retry-count', '2');
            
            // Try without the prefix
            const timestamp = new Date().getTime();
            imgElement.src = `${this.apiUrl}/api/v1/api/users/profile/picture/${patientId}?t=${timestamp}`;
            return;
          }
        }
      }
    }
    
    // If we've tried all API URLs or this is an avatar service error, use fallbacks
    
    // Check if we're already using the UI Avatars service
    if (imgElement.src.includes('ui-avatars.com')) {
      // Already using UI Avatars, show initials instead
      imgElement.style.display = 'none';
      showInitials();
      return;
    }
    
    // Generate fallback avatar URL
    const background = gender === 'MALE' ? '007bff' : gender === 'FEMALE' ? 'ff69b4' : '666666';
    const fallbackUrl = this.getDefaultAvatar(initials, background);
    
    // Set the fallback image
    imgElement.src = fallbackUrl;
    
    // Handle potential error with the fallback image
    imgElement.onerror = () => {
      imgElement.style.display = 'none';
      showInitials();
    };
    
    // Helper function to show initials
    function showInitials() {
      const parent = imgElement.parentElement;
      if (parent && !parent.querySelector('.initials')) {
        const initialsElement = document.createElement('span');
        initialsElement.classList.add('initials');
        
        // Add gender-specific class
        if (gender === 'MALE') {
          initialsElement.classList.add('initials-male');
        } else if (gender === 'FEMALE') {
          initialsElement.classList.add('initials-female');
        }
        
        initialsElement.textContent = initials;
        parent.appendChild(initialsElement);
      }
    }
  }
  
  getAppointmentTypeDisplay(appointment: Appointment): string {
    const typeMap: { [key: string]: string } = {
      'DETARTRAGE': 'Détartrage',
      'SOIN': 'Soin dentaire',
      'EXTRACTION': 'Extraction dentaire',
      'BLANCHIMENT': 'Blanchiment',
      'ORTHODONTIE': 'Orthodontie',
      'CONSULTATION': 'Consultation'
    };
    
    const callType = appointment.appointmentType === 'DETARTRAGE' || 
                     appointment.appointmentType === 'EXTRACTION' ? 
                     'Appel Vidéo' : 'Appel Audio';
    
    const appointmentType = typeMap[appointment.appointmentType] || appointment.appointmentType;
    return `${appointmentType} • ${callType}`;
  }
  
  viewPatientProfile(patient: any): void {
    if (!patient || !patient.id) {
      this.snackBar.open('Les informations du patient ne sont pas disponibles', 'OK', {
        duration: 3000
      });
      return;
    }
    
    // Here you would typically navigate to the patient profile
    // For example:
    // this.router.navigate(['/patient-profile', patient.id]);
    
    // For now, just show a message
    this.snackBar.open(`Profil du patient: ${patient.prenom} ${patient.nom}`, 'OK', {
      duration: 3000
    });
    
    // TODO: Implement navigation to patient profile page or open profile dialog
  }
} 