import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AppointmentService, Appointment, AppointmentStatus } from '../../core/services/appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormDialogComponent } from './book-appointment.component';

@Component({
  selector: 'app-patient-appointments',
  templateUrl: './patient-appointments.component.html',
  styleUrls: ['./patient-appointments.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatPaginatorModule
  ]
})
export class PatientAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  loading: boolean = false;
  error: boolean = false;
  errorMessage: string = '';
  activeTab: string = 'upcoming';
  searchQuery: string = '';
  
  // Pagination variables
  pageSize: number = 5;
  currentPage: number = 0;
  pageSizeOptions: number[] = [5, 10, 25];
  totalAppointments: number = 0;

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  // Pagination handler
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  loadAppointments(): void {
    this.loading = true;
    this.error = false;

    // Try to load both patient and doctor appointments
    this.appointmentService.getMyAppointments().subscribe({
      next: (patientAppointments) => {
        // First, save the patient appointments
        this.appointments = patientAppointments;
        
        // Then try to get the doctor appointments and combine them
        this.appointmentService.getMyDoctorAppointments().subscribe({
          next: (doctorAppointments) => {
            console.log('Doctor appointments loaded:', doctorAppointments.length);
            
            // Combine both sets of appointments, avoiding duplicates by ID
            const existingIds = new Set(this.appointments.map(a => a.id));
            const newAppointments = doctorAppointments.filter(a => !existingIds.has(a.id));
            
            // Add the new, non-duplicate appointments
            this.appointments = [...this.appointments, ...newAppointments];
            console.log('Total appointments after combining:', this.appointments.length);
            
            this.loading = false;
          },
          error: (err) => {
            // If doctor appointments fail, we still have the patient appointments
            console.error('Error loading doctor appointments:', err);
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading patient appointments:', error);
        
        // Try doctor appointments as fallback
        this.appointmentService.getMyDoctorAppointments().subscribe({
          next: (doctorAppointments) => {
            this.appointments = doctorAppointments;
            this.loading = false;
          },
          error: (doctorError) => {
            // Both failed, so show error and use demo data
            console.error('Error loading doctor appointments as fallback:', doctorError);
            this.loading = false;
            this.error = true;
            this.errorMessage = error.message || 'Une erreur est survenue lors du chargement des rendez-vous.';
            
            this.createDemoAppointments();
            
            this.snackBar.open('Erreur de connexion au serveur. Affichage des données de démonstration.', 'Fermer', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'bottom'
            });
          }
        });
      }
    });
  }

  createDemoAppointments(): void {
    const today = new Date();
    const appointments = [];
    
    // Create a series of past appointments
    for (let i = 1; i <= 10; i++) {
      const pastDate = new Date(today);
      pastDate.setDate(pastDate.getDate() - i * 3); // Every 3 days in the past
      
      const status = i % 4 === 0 ? AppointmentStatus.CANCELED : 
                    i % 3 === 0 ? AppointmentStatus.REJECTED :
                    AppointmentStatus.COMPLETED;
      
      const appointmentType = i % 3 === 0 ? 'DETARTRAGE' as any :
                             i % 5 === 0 ? 'EXTRACTION' as any :
                             i % 7 === 0 ? 'BLANCHIMENT' as any :
                             'SOIN' as any;
      
      const doctor = i % 2 === 0 ? {
        id: 1,
        prenom: 'Jean',
        nom: 'Dupont',
        address: '123 Rue de la Médecine, Paris'
      } : {
        id: 2,
        prenom: 'Marie',
        nom: 'Curie',
        address: '456 Avenue de la Science, Lyon'
      };
      
      appointments.push({
        id: 100 + i,
        appointmentDateTime: pastDate.toISOString(),
        status: status,
        caseType: 'NORMAL' as any,
        appointmentType: appointmentType,
        notes: 'Rendez-vous de démonstration',
        doctor: doctor
      });
    }
    
    // Create current and upcoming appointments
    for (let i = 0; i < 15; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(futureDate.getDate() + i * 2); // Every 2 days in the future
      
      const status = i === 0 ? AppointmentStatus.ACCEPTED :
                    i % 5 === 0 ? AppointmentStatus.PENDING :
                    i % 7 === 0 ? AppointmentStatus.CANCELED :
                    AppointmentStatus.ACCEPTED;
      
      const appointmentType = i % 2 === 0 ? 'SOIN' as any :
                             i % 3 === 0 ? 'DETARTRAGE' as any :
                             i % 5 === 0 ? 'EXTRACTION' as any :
                             'ORTHODONTIE' as any;
      
      const doctorIndex = i % 3;
      const doctor = doctorIndex === 0 ? {
        id: 1,
        prenom: 'Jean',
        nom: 'Dupont',
        address: '123 Rue de la Médecine, Paris'
      } : doctorIndex === 1 ? {
        id: 2,
        prenom: 'Marie',
        nom: 'Curie',
        address: '456 Avenue de la Science, Lyon'
      } : {
        id: 3,
        prenom: 'Robert',
        nom: 'Martin',
        address: '789 Boulevard des Soins, Marseille'
      };
      
      appointments.push({
        id: 200 + i,
        appointmentDateTime: futureDate.toISOString(),
        status: status,
        caseType: 'NORMAL' as any,
        appointmentType: appointmentType,
        notes: 'Rendez-vous de démonstration',
        doctor: doctor
      });
    }
    
    this.appointments = appointments;
    this.loading = false;
    this.error = false;
  }

  getFilteredAppointments(): Appointment[] {
    // First, filter appointments by status according to the active tab
    let filtered = this.appointments.filter(a => {
      if (this.activeTab === 'upcoming') {
        return a.status === AppointmentStatus.PENDING || a.status === AppointmentStatus.ACCEPTED;
      } else if (this.activeTab === 'cancelled') {
        return a.status === AppointmentStatus.CANCELED || a.status === AppointmentStatus.REJECTED;
      } else if (this.activeTab === 'completed') {
        return a.status === AppointmentStatus.COMPLETED;
      }
      return true;
    });

    // Apply search query if any
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.doctor?.nom?.toLowerCase().includes(query) || 
        a.doctor?.prenom?.toLowerCase().includes(query) ||
        this.getAppointmentTypeLabel(a.appointmentType).toLowerCase().includes(query) ||
        a.patient?.nom?.toLowerCase().includes(query) || 
        a.patient?.prenom?.toLowerCase().includes(query)
      );
    }

    // Sort appointments by date - upcoming first for "à venir" tab, most recent first for other tabs
    filtered.sort((a, b) => {
      const dateA = new Date(a.appointmentDateTime);
      const dateB = new Date(b.appointmentDateTime);
      
      if (this.activeTab === 'upcoming') {
        return dateA.getTime() - dateB.getTime(); // Ascending order for upcoming
      } else {
        return dateB.getTime() - dateA.getTime(); // Descending order for others
      }
    });

    // Update total for pagination
    this.totalAppointments = filtered.length;

    // Return only the appointments for the current page
    return filtered.slice(this.currentPage * this.pageSize, (this.currentPage * this.pageSize) + this.pageSize);
  }

  getAppointmentTypeLabel(type: string): string {
    switch (type) {
      case 'DETARTRAGE':
        return 'Détartrage';
      case 'SOIN':
        return 'Soin';
      case 'EXTRACTION':
        return 'Extraction';
      case 'BLANCHIMENT':
        return 'Blanchiment';
      case 'ORTHODONTIE':
        return 'Orthodontie';
      default:
        return type;
    }
  }

  getStatusLabel(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.PENDING:
        return 'En attente';
      case AppointmentStatus.ACCEPTED:
        return 'Accepté';
      case AppointmentStatus.REJECTED:
        return 'Refusé';
      case AppointmentStatus.COMPLETED:
        return 'Terminé';
      case AppointmentStatus.CANCELED:
        return 'Annulé';
      default:
        return status;
    }
  }

  getStatusClass(status: AppointmentStatus): string {
    switch (status) {
      case AppointmentStatus.PENDING:
        return 'status-pending';
      case AppointmentStatus.ACCEPTED:
        return 'status-accepted';
      case AppointmentStatus.COMPLETED:
        return 'status-completed';
      case AppointmentStatus.REJECTED:
      case AppointmentStatus.CANCELED:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  cancelAppointment(appointment: Appointment): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      this.appointmentService.cancelAppointment(appointment.id).subscribe({
        next: () => {
          this.loadAppointments();
          this.snackBar.open('Rendez-vous annulé avec succès', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        },
        error: (error) => {
          console.error('Error cancelling appointment:', error);
          this.snackBar.open('Erreur lors de l\'annulation du rendez-vous', 'Fermer', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }

  rescheduleAppointment(appointment: Appointment): void {
    if (!appointment.doctor) {
      this.snackBar.open('Informations du médecin manquantes', 'Fermer', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });
      return;
    }

    const dialogRef = this.dialog.open(AppointmentFormDialogComponent, {
      width: '600px',
      data: {
        doctor: appointment.doctor,
        isEdit: true,
        appointment: appointment
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAppointments();
        this.snackBar.open('Rendez-vous modifié avec succès', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  // Reset to first page when changing tab or search criteria
  resetPagination(): void {
    this.currentPage = 0;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab.toLowerCase();
    this.resetPagination();
  }

  filterAppointments(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.resetPagination();
  }
} 