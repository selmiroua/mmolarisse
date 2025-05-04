import { Component, OnInit, HostListener, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AppointmentListComponent } from './appointment/appointment-list.component';
import { AppointmentTabsComponent } from './appointment/appointment-tabs.component';
import { AppointmentCalendarComponent } from './appointment/appointment-calendar.component';
import { ProfileComponent } from '../profile/profile.component';
import { ValidateAccountComponent } from '../validate-account/validate-account.component';
import { NotificationBellComponent } from './shared/notification-bell/notification-bell.component';
import { DoctorApplicationComponent } from '../secretary/doctor-application/doctor-application.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SecretaryService } from '../core/services/secretary.service';
import { RouterModule } from '@angular/router';
import { SecretaryAppointmentListComponent } from './appointment/secretary-appointment-list.component';
import { VerifiedDoctorsComponent } from '../secretary/verified-doctors/verified-doctors.component';
import { ProfileService } from '../profile/profile.service';
import { environment } from '../../environments/environment';
import { filter } from 'rxjs/operators';
import { NavigationEnd } from '@angular/router';
import { AppointmentService } from '../core/services/appointment.service';
import { DirectAppointmentsComponent } from './appointment/direct-appointments.component';

@Component({
  selector: 'app-secretaire-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule,
    AppointmentListComponent,
    AppointmentTabsComponent,
    AppointmentCalendarComponent,
    SecretaryAppointmentListComponent,
    ProfileComponent,
    DoctorApplicationComponent,
    VerifiedDoctorsComponent,
    NotificationBellComponent,
    ValidateAccountComponent,
    DirectAppointmentsComponent
  ],
  templateUrl: './secretaire-dashboard.component.html',
  styleUrls: ['./secretaire-dashboard.component.scss']
})
export class SecretaireDashboardComponent implements OnInit, AfterViewInit {
  isMenuOpen = true;
  activeSection = 'dashboard';
  unreadNotifications = 0;
  isAssignedToDoctor = true;
  profileImageUrl: string | null = null;
  secretaryName = '';
  isProfileDropdownOpen = false;
  showFallbackAppointments = false;

  @ViewChild(AppointmentTabsComponent) appointmentTabsComponent: AppointmentTabsComponent | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private userService: UserService,
    private secretaryService: SecretaryService,
    private snackBar: MatSnackBar,
    private profileService: ProfileService,
    private appointmentService: AppointmentService
  ) {
    // No need to check assignment status since we're showing all items
  }

  ngOnInit(): void {
    console.clear(); // Clear console for fresh debugging
    console.log('Initializing SecretaireDashboardComponent');
    
    // If the URL has a specific section, use that, otherwise default to dashboard
    const path = this.router.url.split('/').pop();
    if (path) {
      switch (path) {
        case 'profile':
          this.activeSection = 'profile';
          break;
        case 'appointments':
          this.activeSection = 'appointments';
          break;
        case 'calendar':
          this.activeSection = 'calendar';
          break;
        case 'doctor-application':
          this.activeSection = 'doctor-application';
          break;
        default:
          this.activeSection = 'dashboard';
      }
    }
    
    console.log('Initial active section:', this.activeSection);
    
    // Load notifications and secretary profile
    this.loadNotifications();
    this.loadSecretaryProfile();
  }

  ngAfterViewInit(): void {
    console.log('View initialized');
  }

  // Simplified method - we still call the API for data but don't restrict UI
  checkDoctorAssignment(): void {
    console.log('Starting doctor assignment check...');
    
    this.secretaryService.getSecretaryStatus().subscribe({
      next: (response) => {
        console.log('Secretary status response:', response);
        // We get the status but don't use it to restrict the UI
      },
      error: (error) => {
        console.error('Error checking secretary status:', error);
      }
    });
  }

  loadNotifications(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadNotifications = count;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des notifications', error);
      }
    });
  }

  loadSecretaryProfile() {
    this.profileService.getCurrentProfile().subscribe({
      next: (profile) => {
        console.log('Profile loaded:', profile);
        const capitalizedNom = profile.nom.charAt(0).toUpperCase() + profile.nom.slice(1);
        const capitalizedPrenom = profile.prenom.charAt(0).toUpperCase() + profile.prenom.slice(1);
        this.secretaryName = `${capitalizedNom} ${capitalizedPrenom}`;
        this.profileImageUrl = this.getProfileImageUrl(profile.profilePicturePath);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.setDefaultValues();
      }
    });
  }

  private setDefaultValues(): void {
    this.secretaryName = '';
    this.profileImageUrl = null;
  }

  getProfileImageUrl(profilePicturePath?: string): string {
    if (profilePicturePath) {
      try {
        const timestamp = new Date().getTime();
        return `${environment.apiUrl}/api/v1/api/users/profile/picture/${profilePicturePath}?t=${timestamp}`;
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

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  showDashboard(): void {
    this.activeSection = 'dashboard';
  }

  showProfile(): void {
    this.activeSection = 'profile';
    this.isProfileDropdownOpen = false;
  }

  showValidateAccount(): void {
    this.activeSection = 'validate';
  }

  showAppointments(): void {
    console.log('Showing appointments section');
    this.activeSection = 'appointments';
    // No need for the complex refresh logic anymore since we have a direct component
  }

  showCalendar(): void {
    this.activeSection = 'calendar';
  }

  showDoctorApplication(): void {
    this.activeSection = 'doctor-application';
  }

  showSettings(): void {
    // Route to settings page when it exists
    // For now, just close the dropdown
    this.isProfileDropdownOpen = false;
  }

  showNotifications() {
    // Route to notifications page when it exists
    // For now, just close the dropdown
    this.isProfileDropdownOpen = false;
  }

  logout(): void {
    // Clear all storage first
    localStorage.clear();
    sessionStorage.clear();
    
    // Call auth service to notify server (non-blocking)
    this.authService.logout();
    
    // Force a complete page reload and redirect
    window.location.replace('/login');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const profileElement = (event.target as HTMLElement).closest('.user-profile');
    if (!profileElement) {
      this.isProfileDropdownOpen = false;
    }
  }

  refreshAppointments(): void {
    console.log('Manual refresh of appointments triggered');
    
    // First, make sure the fallback is shown if we've been having problems
    if (!this.appointmentTabsComponent && !document.querySelector('app-appointment-tabs')) {
      console.log('No appointment tabs component found, showing fallback');
      this.showFallbackAppointments = true;
    }
    
    if (this.appointmentTabsComponent) {
      console.log('Found appointment tabs component through ViewChild, refreshing');
      // Call the loadAppointments method directly on the component instance
      this.appointmentTabsComponent.loadAppointments();
      
      // Show confirmation message
      this.snackBar.open('Actualisation des rendez-vous en cours...', 'OK', {
        duration: 3000
      });
    } else {
      console.log('Trying to find component in the DOM as fallback');
      // Try to find the component in the DOM as a fallback
      setTimeout(() => {
        const appointmentTabsElement = document.querySelector('app-appointment-tabs');
        if (appointmentTabsElement) {
          console.log('Found appointment tabs component via DOM, triggering refresh event');
          
          try {
            // Create and dispatch refresh event
            const refreshEvent = new Event('refresh');
            appointmentTabsElement.dispatchEvent(refreshEvent);
            
            this.snackBar.open('Actualisation des rendez-vous en cours...', 'OK', {
              duration: 3000
            });
          } catch (error) {
            console.error('Error dispatching refresh event:', error);
            this.snackBar.open('Erreur lors de l\'actualisation', 'OK', {
              duration: 3000
            });
          }
        } else {
          console.error('Appointment tabs component not found in the DOM');
          this.snackBar.open('Impossible de rafraîchir les rendez-vous. Veuillez recharger la page.', 'OK', {
            duration: 3000
          });
        }
      }, 500); // Longer timeout to ensure DOM is ready
    }
  }

  forceLoadAppointments(): void {
    console.log('Directly calling appointment service to load appointments');
    this.snackBar.open('Chargement des rendez-vous en cours...', 'OK', {
      duration: 2000
    });
    
    this.appointmentService.getMySecretaryAppointments().subscribe({
      next: (appointments) => {
        console.log(`Loaded ${appointments.length} appointments directly:`, appointments);
        this.snackBar.open(`${appointments.length} rendez-vous chargés avec succès`, 'OK', {
          duration: 3000
        });
        
        // Force refresh of component if it exists
        if (this.appointmentTabsComponent) {
          this.appointmentTabsComponent.appointments = appointments;
          this.appointmentTabsComponent.loading = false;
          this.appointmentTabsComponent.activeTab = 'upcoming';
        } else {
          console.error('Cannot update appointments display - component not found');
          // Activate fallback view
          this.showFallbackAppointments = true;
        }
      },
      error: (error) => {
        console.error('Error loading appointments directly:', error);
        this.snackBar.open('Erreur lors du chargement des rendez-vous', 'Fermer', {
          duration: 5000
        });
        // Show fallback on error
        this.showFallbackAppointments = true;
      }
    });
  }
}
