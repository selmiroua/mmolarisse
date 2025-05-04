import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfileWrapperComponent } from '../profile-wrapper/profile-wrapper.component';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';
import { AppointmentListComponent } from '../appointment-list/appointment-list.component';
import { AppointmentTabsComponent } from './appointment/appointment-tabs.component';
import { ProfileComponent } from "../profile/profile.component";
import { ValidateAccountComponent } from "../validate-account/validate-account.component";
import { BookAppointmentComponent, AppointmentFormDialogComponent } from './appointment/book-appointment.component';
import { AppointmentService, Appointment, AppointmentType, CaseType, AppointmentStatus } from '../core/services/appointment.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WelcomeModalComponent } from '../shared/components/welcome-modal/welcome-modal.component';
import { PatientService } from '../core/services/patient.service';


@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatMenuModule, 
    MatIconModule, 
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    ProfileWrapperComponent, 
    NotificationBellComponent, 
    AppointmentListComponent,
    AppointmentTabsComponent,
    ProfileComponent, 
    ValidateAccountComponent, 
    BookAppointmentComponent,
    WelcomeModalComponent,
    AppointmentFormDialogComponent
  ]
})
export class PatientDashboardComponent implements OnInit {
  isBaseRoute: boolean = true;
  isMenuOpen: boolean = false;
  activeSection: string = 'dashboard';
  appointments: Appointment[] = [];
  loading: boolean = false;
  patientName: string = '';
  
  // New properties for appointments handling
  appointmentsLoading: boolean = false;
  appointmentsError: boolean = false;
  appointmentsErrorMessage: string = '';
  
  // New properties for appointments tabs
  activeTab: string = 'upcoming';
  dateRange: string = '04/28/2023 - 05/04/2023';
  searchQuery: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private patientService: PatientService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isBaseRoute = event.url === '/dashboard/patient';
    });
  }

  ngOnInit(): void {
    this.isBaseRoute = this.router.url === '/dashboard/patient';
    this.route.queryParams.subscribe(params => {
      if (params['section'] === 'profile') {
        this.activeSection = 'profile';
      } else if (params['section'] === 'appointments') {
        this.activeSection = 'appointments';
      } else if (params['section'] === 'book-appointment') {
        this.activeSection = 'book-appointment';
      }
    });
    
    // Load appointments data for dashboard view
    this.loadAppointments();
    
    // First get the current user
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.patientName = user.prenom + ' ' + user.nom;
        
        // Then check if they have a fiche
        this.patientService.getCurrentPatientFiche().subscribe({
          next: (fiche) => {
            // If we get a 404 or no fiche exists, show the welcome modal
            if (!fiche || !fiche.id) {
              console.log('No fiche found, showing welcome modal');
              this.dialog.open(WelcomeModalComponent, {
                data: { userName: this.patientName },
                disableClose: true,
                width: '900px',
                maxWidth: '98vw',
              });
            } else {
              console.log('Fiche exists, skipping welcome modal');
            }
          },
          error: (err) => {
            // If we get a 404, show the welcome modal
            if (err.status === 404) {
              console.log('No fiche found (404), showing welcome modal');
              this.dialog.open(WelcomeModalComponent, {
                data: { userName: this.patientName },
                disableClose: true,
                width: '900px',
                maxWidth: '98vw',
              });
            } else {
              console.error('Error checking fiche:', err);
            }
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch user info', err);
      }
    });
  }

  loadAppointments(): void {
    this.loading = true;
    console.log('Loading patient appointments in dashboard...');
    
    this.appointmentService.getPatientAppointments().subscribe({
      next: (appointments: Appointment[]) => {
        console.log('Successfully fetched appointments:', appointments);
        this.appointments = appointments;
        
        // Log the doctor object structure in detail
        if (appointments.length > 0 && appointments[0].doctor) {
          console.log('DOCTOR OBJECT STRUCTURE (detailed):');
          console.log(JSON.stringify(appointments[0].doctor, null, 2));
          
          // If doctor has userProfile, log it
          if (appointments[0].doctor.userProfile) {
            console.log('Doctor userProfile:', appointments[0].doctor.userProfile);
          }
          
          // If doctor has user, log it
          if (appointments[0].doctor.user) {
            console.log('Doctor user:', appointments[0].doctor.user);
          }
        }
        
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error loading appointments:', error);
        this.loading = false;
        // Show an error message to the user
        this.snackBar.open('Erreur lors du chargement des rendez-vous', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  getAppointmentTypeLabel(type: AppointmentType): string {
    switch (type) {
      case AppointmentType.DETARTRAGE:
        return 'Détartrage';
      case AppointmentType.SOIN:
        return 'Soin';
      case AppointmentType.EXTRACTION:
        return 'Extraction';
      case AppointmentType.BLANCHIMENT:
        return 'Blanchiment';
      case AppointmentType.ORTHODONTIE:
        return 'Orthodontie';
      default:
        return type;
    }
  }

  getCaseTypeLabel(type: CaseType): string {
    switch (type) {
      case CaseType.URGENT:
        return 'Urgent';
      case CaseType.CONTROL:
        return 'Contrôle';
      case CaseType.NORMAL:
        return 'Normal';
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

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'schedule';
      case 'ACCEPTED':
        return 'check_circle';
      case 'REJECTED':
        return 'cancel';
      case 'COMPLETED':
        return 'task_alt';
      case 'CANCELED':
        return 'event_busy';
      default:
        return 'help';
    }
  }

  getCaseTypeIcon(type: string): string {
    switch (type) {
      case 'URGENT':
        return 'priority_high';
      case 'CONTROL':
        return 'event_repeat';
      case 'NORMAL':
        return 'check_circle_outline';
      default:
        return 'info';
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

  viewAppointmentDetails(appointment: Appointment): void {
    this.dialog.open(BookAppointmentComponent, {
      width: '600px',
      data: {
        isView: true,
        appointment: appointment
      }
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  showDashboard(): void {
    this.activeSection = 'dashboard';
    this.router.navigate([], { queryParams: { section: null }, queryParamsHandling: 'merge' });
  }

  showProfile(): void {
    this.activeSection = 'profile';
    this.router.navigate([], { queryParams: { section: 'profile' }, queryParamsHandling: 'merge' });
  }

  showAppointments(): void {
    console.log('Showing appointments view...');
    this.activeSection = 'appointments';
    this.router.navigate([], { queryParams: { section: 'appointments' }, queryParamsHandling: 'merge' });
    
    // Start loading indicator
    this.appointmentsLoading = true;
    this.appointmentsError = false;
    
    // Fetch appointments fresh when viewing this section
    this.refreshAppointments();
  }

  navigateToBookAppointment(): void {
    this.activeSection = 'book-appointment';
    this.router.navigate([], { queryParams: { section: 'book-appointment' }, queryParamsHandling: 'merge' });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
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

  refreshAppointments(): void {
    this.appointmentsLoading = true;
    this.appointmentsError = false;
    
    console.log('Manually refreshing appointments...');
    
    this.appointmentService.getPatientAppointments().subscribe({
      next: (appointments) => {
        console.log('Successfully refreshed appointments:', appointments);
        this.appointments = appointments;
        this.appointmentsLoading = false;
        
        // Log doctor info for debugging
        if (appointments.length > 0) {
          const firstDoctor = appointments[0].doctor;
          console.log('First doctor info:', firstDoctor);
          console.log('Email resolved to:', this.getDoctorEmail(firstDoctor));
          console.log('Phone resolved to:', this.getDoctorPhone(firstDoctor));
        }
      },
      error: (error) => {
        console.error('Error refreshing appointments:', error);
        this.appointmentsLoading = false;
        this.appointmentsError = true;
        this.appointmentsErrorMessage = error.message || 'Une erreur est survenue lors du chargement des rendez-vous.';
        
        this.snackBar.open('Erreur lors du chargement des rendez-vous', 'Fermer', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  getAppointmentTypeForDisplay(type: AppointmentType): string {
    // This method allows us to perform string comparisons in the template
    // We need to convert the enum to a string representation for comparison
    return type ? type.toString() : '';
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/images/default-avatar.png';
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  getTabCount(status: string, additionalStatus?: string): number {
    return this.appointments.filter(a => 
      a.status === status || (additionalStatus && a.status === additionalStatus)
    ).length;
  }
  
  getFilteredAppointments(): Appointment[] {
    // Filter by active tab
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
    
    // Filter by search query if present
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.doctor?.nom?.toLowerCase().includes(query) || 
        a.doctor?.prenom?.toLowerCase().includes(query) ||
        this.getAppointmentTypeLabel(a.appointmentType).toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }
  
  filterAppointments(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  getDoctorEmail(doctor: any): string {
    if (!doctor) return 'N/A';
    
    console.log('Getting doctor email from:', doctor);
    
    // Check different possible locations for email
    const email = doctor.email || 
                 (doctor.user && doctor.user.email) || 
                 (doctor.userProfile && doctor.userProfile.email) ||
                 'N/A';
                 
    console.log('Resolved email to:', email);
    return email;
  }

  getDoctorPhone(doctor: any): string {
    if (!doctor) return 'N/A';
    
    console.log('Getting doctor phone from:', doctor);
    
    // Check different possible locations for phone
    const phone = doctor.phoneNumber || 
                 doctor.phone || 
                 (doctor.user && doctor.user.phoneNumber) || 
                 (doctor.userProfile && doctor.userProfile.phoneNumber) ||
                 'N/A';
                 
    console.log('Resolved phone to:', phone);
    return phone;
  }

  getDoctorName(doctor: any): string {
    if (!doctor) return 'Unknown Doctor';
    
    const firstName = doctor.prenom || (doctor.userProfile && doctor.userProfile.prenom) || '';
    const lastName = doctor.nom || (doctor.userProfile && doctor.userProfile.nom) || '';
    
    if (!firstName && !lastName) return 'Dr.';
    
    return `Dr. ${lastName} ${firstName}`.trim();
  }
}
