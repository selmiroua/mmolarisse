import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarOptions, EventApi, EventDropArg, EventClickArg, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AppointmentService, Appointment, AppointmentStatus } from '../core/services/appointment.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService, User } from '../auth/auth.service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AppointmentDetailsDialogComponent } from '../appointment-details-dialog/appointment-details-dialog.component';
import { Router } from '@angular/router';
import { ConfirmAppointmentDialogComponent } from './confirm-appointment-dialog.component';
import { UnregisteredPatientAppointmentDialogComponent } from './unregistered-patient-appointment-dialog.component';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-appointment-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule,
    ConfirmAppointmentDialogComponent,
    UnregisteredPatientAppointmentDialogComponent
  ],
  template: `
    <div class="calendar-container">
      <div class="calendar-header">
        <button class="refresh-button" (click)="forceCalendarRefresh()" title="Rafraîchir les rendez-vous">
          <mat-icon>refresh</mat-icon> Rafraîchir
        </button>
      </div>
+      <full-calendar #calendar [options]="calendarOptions"></full-calendar>
    </div>
  `,
  styles: [`
    .calendar-container {
      height: 75vh;
      margin: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .calendar-header {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;
    }
    
    .refresh-button {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 8px 16px;
      background-color: #f0f0f0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }
    
    .refresh-button:hover {
      background-color: #e0e0e0;
    }
    
    .refresh-button mat-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
      line-height: 18px;
    }
  `]
})
export class AppointmentCalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: any;
  @Input() userRole: 'doctor' | 'secretaire' = 'doctor';
  calendarEvents: Array<{
    id: string;
    title: string;
    start: Date;
    end: Date;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    extendedProps: {
      status: AppointmentStatus;
      appointment: Appointment;
    };
  }> = [];
  currentUser: User | null = null;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    weekends: true,
    editable: true, // Allow dragging events
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: this.calendarEvents,
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    select: this.handleDateSelect.bind(this), // Ajout de la gestion de la sélection de date
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: false,
    locale: 'fr',
    buttonText: {
      today: "Aujourd'hui",
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour'
    }
  };

  constructor(
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadAppointments();
  }

  loadCurrentUser(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  // Helper method to create a date without timezone conversion
  private createLocalDate(dateString: string): Date {
    // Parse the date string
    const originalDate = new Date(dateString);
    
    // Get local date components
    const year = originalDate.getFullYear();
    const month = originalDate.getMonth();
    const day = originalDate.getDate();
    const hours = originalDate.getHours();
    const minutes = originalDate.getMinutes();
    
    // Create new date with local timezone
    const localDate = new Date();
    localDate.setFullYear(year, month, day);
    localDate.setHours(hours, minutes, 0, 0); // Use original hours
    
    console.log(`Converted date: ${dateString} -> ${localDate.toLocaleString()}`);
    return localDate;
  }

  loadAppointments(): void {
    console.log('Loading appointments for role:', this.userRole);
    
    // Récupérer directement tous les rendez-vous du médecin assigné à la secrétaire
    // au lieu d'utiliser getMySecretaryAppointments qui pourrait filtrer certains rendez-vous
    const appointmentObservable = this.userRole === 'doctor' 
      ? this.appointmentService.getMyDoctorAppointments()
      : this.appointmentService.getMySecretaryAppointments();

    appointmentObservable.subscribe({
      next: (appointments) => {
        console.log('Appointments loaded:', appointments);
        console.log('Number of appointments:', appointments.length);
        
        // Vérifier les rendez-vous pour les patients non inscrits
        this.checkForUnregisteredPatients(appointments);
        
        // Créer un tableau pour stocker les événements du calendrier
        const events: Array<{
          id: string;
          title: string;
          start: Date;
          end: Date;
          backgroundColor: string;
          borderColor: string;
          textColor: string;
          extendedProps: {
            status: AppointmentStatus;
            appointment: Appointment;
          };
        }> = [];
        
        // Traiter chaque rendez-vous individuellement pour éviter les erreurs
        appointments.forEach((appointment, index) => {
          try {
            console.log(`Processing appointment ${index + 1}/${appointments.length}:`, appointment);
            
            // Vérifier si le rendez-vous a toutes les données nécessaires
            if (!appointment || !appointment.id || !appointment.appointmentDateTime) {
              console.warn(`Skipping invalid appointment at index ${index}:`, appointment);
              return; // Passer au rendez-vous suivant
            }
            
            const eventColor = this.getStatusColor(appointment.status);
            
            // S'assurer que les dates sont correctement formatées sans conversion de fuseau horaire
            let startDate;
            try {
              // Utiliser la méthode createLocalDate pour éviter les problèmes de fuseau horaire
              startDate = this.createLocalDate(appointment.appointmentDateTime);
              if (isNaN(startDate.getTime())) {
                console.warn(`Invalid date for appointment ${appointment.id}:`, appointment.appointmentDateTime);
                return; // Passer au rendez-vous suivant
              }
            } catch (error) {
              console.error(`Error parsing date for appointment ${appointment.id}:`, error);
              return; // Passer au rendez-vous suivant
            }
            
            console.log(`Appointment ${appointment.id} date:`, startDate);
            
            // Créer le titre de l'événement
            let title;
            try {
              title = this.createEventTitle(appointment);
            } catch (error) {
              console.error(`Error creating title for appointment ${appointment.id}:`, error);
              title = `Rendez-vous #${appointment.id}`;
            }
            
            // Créer l'événement pour le calendrier
            const event = {
              id: appointment.id.toString(), // Convertir en chaîne pour éviter les problèmes
              title: title,
              start: startDate,
              end: new Date(startDate.getTime() + 30 * 60000), // 30 minutes later
              backgroundColor: eventColor.background,
              borderColor: eventColor.border,
              textColor: eventColor.text,
              extendedProps: {
                status: appointment.status,
                appointment: appointment
              }
            };
            
            console.log(`Created calendar event for appointment ${appointment.id}:`, event);
            events.push(event);
          } catch (error) {
            console.error(`Error processing appointment ${index + 1}:`, error);
          }
        });
        
        console.log('Calendar events created:', events.length);
        this.calendarEvents = events;
        
        // Update calendar events
        if (this.calendarComponent && this.calendarComponent.getApi) {
          console.log('Updating calendar via API');
          const calendarApi = this.calendarComponent.getApi();
          calendarApi.removeAllEvents();
          calendarApi.addEventSource(events);
          calendarApi.render(); // Force le rendu
        } else {
          console.log('Updating calendar via options');
          this.calendarOptions.events = events;
        }
      },
      error: (error) => {
        console.error('Error loading appointments', error);
        this.snackBar.open('Erreur lors du chargement des rendez-vous', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  // Méthode pour gérer la sélection de date/heure dans le calendrier
  handleDateSelect(selectInfo: DateSelectArg): void {
    // Vérifier si l'utilisateur est une secrétaire
    if (this.userRole !== 'secretaire') {
      return;
    }

    // Vérifier si la date sélectionnée n'est pas dans le passé
    const now = new Date();
    if (selectInfo.start < now) {
      this.snackBar.open('Impossible de créer un rendez-vous dans le passé', 'Fermer', { 
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    // Utiliser la date locale sans conversion de fuseau horaire
    const selectedDate = selectInfo.start;
    console.log('Selected date for appointment:', selectedDate);

    // Formater la date pour l'affichage
    const formattedDate = selectedDate.toLocaleString('fr-FR', {
      weekday: 'long',
      day: 'numeric', 
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Demander confirmation à l'utilisateur
    const confirmDialog = this.dialog.open(ConfirmAppointmentDialogComponent, {
      width: '400px',
      data: {
        date: formattedDate,
        start: selectedDate
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result === 'create') {
        // Ouvrir directement le dialogue de création de rendez-vous
        this.openUnregisteredPatientAppointmentDialog(selectedDate);
      }
    });
  }

  // Méthode pour forcer un rechargement complet du calendrier
  forceCalendarRefresh(): void {
    console.log('Forcing complete calendar refresh');
    
    // 1. Vider complètement le calendrier
    if (this.calendarComponent && this.calendarComponent.getApi) {
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
    }
    
    // 2. Recharger tous les rendez-vous directement depuis l'API
    console.log('Fetching all appointments for secretary\'s doctor');
    
    // Utiliser la méthode spéciale qui récupère tous les rendez-vous sans filtrage
    const appointmentObservable = this.userRole === 'doctor' 
      ? this.appointmentService.getMyDoctorAppointments()
      : this.appointmentService.getAllAppointmentsForSecretaryDoctor();
    
    appointmentObservable.subscribe({
      next: (appointments) => {
        console.log('Force refresh - Appointments loaded:', appointments);
        console.log('Force refresh - Number of appointments:', appointments.length);
        
        // Vérifier les rendez-vous pour les patients non inscrits
        this.checkForUnregisteredPatients(appointments);
        
        // Créer un tableau pour stocker les événements du calendrier
        const calendarEvents: Array<{
          id: string;
          title: string;
          start: Date;
          end: Date;
          backgroundColor: string;
          borderColor: string;
          textColor: string;
          extendedProps: {
            status: AppointmentStatus;
            appointment: Appointment;
          };
        }> = [];
        
        // Traiter chaque rendez-vous individuellement pour éviter les erreurs
        appointments.forEach((appointment, index) => {
          try {
            console.log(`Processing appointment ${index + 1}/${appointments.length}:`, appointment);
            
            // Vérifier si le rendez-vous a toutes les données nécessaires
            if (!appointment || !appointment.id || !appointment.appointmentDateTime) {
              console.warn(`Skipping invalid appointment at index ${index}:`, appointment);
              return; // Passer au rendez-vous suivant
            }
            
            const eventColor = this.getStatusColor(appointment.status);
            
            // S'assurer que les dates sont correctement formatées sans conversion de fuseau horaire
            let startDate;
            try {
              // Utiliser la méthode createLocalDate pour éviter les problèmes de fuseau horaire
              startDate = this.createLocalDate(appointment.appointmentDateTime);
              if (isNaN(startDate.getTime())) {
                console.warn(`Invalid date for appointment ${appointment.id}:`, appointment.appointmentDateTime);
                return; // Passer au rendez-vous suivant
              }
            } catch (error) {
              console.error(`Error parsing date for appointment ${appointment.id}:`, error);
              return; // Passer au rendez-vous suivant
            }
            
            console.log(`Appointment ${appointment.id} date:`, startDate);
            
            // Créer le titre de l'événement
            let title;
            try {
              title = this.createEventTitle(appointment);
            } catch (error) {
              console.error(`Error creating title for appointment ${appointment.id}:`, error);
              title = `Rendez-vous #${appointment.id}`;
            }
            
            // Créer l'événement pour le calendrier
            const event = {
              id: appointment.id.toString(), // Convertir en chaîne pour éviter les problèmes
              title: title,
              start: startDate,
              end: new Date(startDate.getTime() + 30 * 60000), // 30 minutes later
              backgroundColor: eventColor.background,
              borderColor: eventColor.border,
              textColor: eventColor.text,
              extendedProps: {
                status: appointment.status,
                appointment: appointment
              }
            };
            
            console.log(`Created calendar event for appointment ${appointment.id}:`, event);
            calendarEvents.push(event);
          } catch (error) {
            console.error(`Error processing appointment ${index + 1}:`, error);
          }
        });
        
        console.log('Calendar events created:', calendarEvents.length);
        this.calendarEvents = calendarEvents;
        
        // Update calendar events
        if (this.calendarComponent && this.calendarComponent.getApi) {
          console.log('Force refresh - Updating calendar via API');
          const calendarApi = this.calendarComponent.getApi();
          calendarApi.removeAllEvents();
          calendarApi.addEventSource(calendarEvents);
          calendarApi.render(); // Force le rendu complet
          
          // Afficher un message de succès
          this.snackBar.open(`Calendrier rafraîchi avec succès (${calendarEvents.length} rendez-vous)`, 'Fermer', {
            duration: 3000
          });
        }
      },
      error: (error) => {
        console.error('Force refresh - Error loading appointments', error);
        this.snackBar.open('Erreur lors du rechargement des rendez-vous', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  // Méthode pour vérifier les rendez-vous des patients non inscrits
  checkForUnregisteredPatients(appointments: Appointment[]): void {
    console.log('Checking for unregistered patient appointments...');
    
    // Filtrer les rendez-vous qui pourraient être pour des patients non inscrits
    // (par exemple, ceux créés récemment ou qui ont des attributs spécifiques)
    const potentialUnregisteredAppointments = appointments.filter(apt => {
      const createdRecently = new Date(apt.appointmentDateTime) > new Date(Date.now() - 24 * 60 * 60 * 1000); // Dernières 24h
      return createdRecently;
    });
    
    console.log('Potential unregistered patient appointments:', potentialUnregisteredAppointments);
    
    // Afficher les détails de chaque rendez-vous potentiel
    potentialUnregisteredAppointments.forEach((apt, index) => {
      console.log(`Appointment ${index + 1}:`, {
        id: apt.id,
        patientName: apt.patient ? `${apt.patient.prenom} ${apt.patient.nom}` : 'Unknown',
        patientEmail: apt.patient?.email,
        date: apt.appointmentDateTime,
        status: apt.status,
        type: apt.appointmentType
      });
    });
  }

  // Nouvelle méthode pour ouvrir le dialogue de prise de rendez-vous
  openUnregisteredPatientAppointmentDialog(appointmentDateTime: Date): void {
    console.log('Opening appointment dialog for date:', appointmentDateTime);
    
    // IMPORTANT: Add 2 hours to fix timezone issue for new appointments
    // When a secretary creates an appointment, we need to add 2 hours to the time
    // to ensure it appears at the correct time in the calendar
    const adjustedHours = appointmentDateTime.getHours() + 2; // Add 2 hours for new appointments
    
    // Format the date for the backend in ISO format without timezone
    const formattedDate = `${appointmentDateTime.getFullYear()}-${String(appointmentDateTime.getMonth() + 1).padStart(2, '0')}-${String(appointmentDateTime.getDate()).padStart(2, '0')}T${String(adjustedHours).padStart(2, '0')}:${String(appointmentDateTime.getMinutes()).padStart(2, '0')}:00`;
    console.log('Formatted date for dialog (adjusted +2h for new appointments):', formattedDate);
    
    const dialogRef = this.dialog.open(UnregisteredPatientAppointmentDialogComponent, {
      width: '700px',
      data: { 
        appointmentDateTime: appointmentDateTime,
        formattedDateTime: formattedDate
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
      if (result && (result === true || result.success === true)) {
        console.log('Reloading appointments after successful creation');
        
        // Forcer un rafraîchissement complet du calendrier
        setTimeout(() => {
          // Utiliser la nouvelle méthode de rechargement complet
          this.forceCalendarRefresh();
          
          // Forcer le rendu du calendrier
          setTimeout(() => {
            if (this.calendarComponent && this.calendarComponent.getApi) {
              console.log('Forcing calendar render');
              const calendarApi = this.calendarComponent.getApi();
              calendarApi.render(); // Force le rendu du calendrier
            }
          }, 100);
        }, 500); // Petit délai pour s'assurer que le backend a bien enregistré le rendez-vous
      }
    });
  }

  createEventTitle(appointment: Appointment): string {
    const patientName = appointment.patient 
      ? `${appointment.patient.prenom} ${appointment.patient.nom}`
      : 'Patient inconnu';
    
    const appointmentType = appointment.appointmentType || '';
    return `${patientName} - ${appointmentType}`;
  }

  // Update the calculateEndTime method to handle timezone correctly
  calculateEndTime(startTimeStr: string): string {
    console.log('Calculating end time for:', startTimeStr);
    try {
      // Use our custom method to create a date without timezone issues
      const startTime = this.createLocalDate(startTimeStr);
      console.log('Parsed start time:', startTime);
      if (isNaN(startTime.getTime())) {
        console.error('Invalid date:', startTimeStr);
        return new Date().toISOString(); // Fallback to current time
      }
      const endTime = new Date(startTime.getTime() + 30 * 60000); // Add 30 minutes
      console.log('Calculated end time:', endTime);
      return endTime.toISOString();
    } catch (error) {
      console.error('Error calculating end time:', error);
      return new Date().toISOString(); // Fallback to current time
    }
  }

  getStatusColor(status: AppointmentStatus): { background: string, border: string, text: string } {
    switch (status) {
      case AppointmentStatus.PENDING:
        return { background: '#fff3e0', border: '#f57c00', text: '#000' };
      case AppointmentStatus.ACCEPTED:
        return { background: '#e8f5e9', border: '#2e7d32', text: '#000' };
      case AppointmentStatus.COMPLETED:
        return { background: '#e3f2fd', border: '#1976d2', text: '#000' };
      case AppointmentStatus.REJECTED:
      case AppointmentStatus.CANCELED:
        return { background: '#ffebee', border: '#c62828', text: '#000' };
      default:
        return { background: '#eceff1', border: '#607d8b', text: '#000' };
    }
  }

  handleEventDrop(info: EventDropArg): void {
    const { event } = info;
    const appointmentId = parseInt(event.id);
    
    // Get the date without timezone conversion
    let newDateTime: string | null = null;
    if (event.start) {
      const start = event.start;
      // For existing appointments, don't adjust the time
      
      // Format date in ISO format but without timezone information
      newDateTime = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}T${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}:00`;
      console.log('Formatted date for event drop:', newDateTime);
    }

    if (!appointmentId || !newDateTime) {
      this.snackBar.open('Impossible de mettre à jour le rendez-vous', 'Fermer', { 
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      info.revert();
      return;
    }

    const appointment = event.extendedProps['appointment'];
    if (!appointment) {
      info.revert();
      return;
    }

    // Check if the appointment can be edited (not past, not canceled, etc.)
    if (![AppointmentStatus.PENDING, AppointmentStatus.ACCEPTED].includes(appointment.status)) {
      this.snackBar.open('Impossible de modifier ce rendez-vous en raison de son statut', 'Fermer', { 
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      info.revert();
      return;
    }

    // Format date for display
    const formatDate = new Date(event.start!).toLocaleString('fr-FR', {
      weekday: 'long',
      day: 'numeric', 
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Confirm the change
    if (confirm(`Confirmer le changement du rendez-vous au ${formatDate}?`)) {
      this.updateAppointmentTime(appointmentId, newDateTime, event);
    } else {
      info.revert();
    }
  }

  updateAppointmentTime(appointmentId: number, newDateTime: string, event: EventApi): void {
    // We already adjusted the time in handleEventDrop, so we can use it directly
    const formattedDate = newDateTime;
    
    console.log('Original date:', newDateTime);
    console.log('Formatted date for backend:', formattedDate);
    
    const updateMethod = this.userRole === 'doctor'
      ? this.appointmentService.updateAppointmentTimeByDoctor(appointmentId, formattedDate)
      : this.appointmentService.updateAppointmentTimeBySecretary(appointmentId, formattedDate);

    updateMethod.subscribe({
      next: (updatedAppointment) => {
        // Format date for display
        const formattedDate = new Date(event.start!).toLocaleString('fr-FR', {
          weekday: 'long',
          day: 'numeric', 
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        // Show success message
        this.snackBar.open(
          `Rendez-vous reprogrammé avec succès pour le ${formattedDate}. Le patient a été notifié.`, 
          'Fermer', 
          { 
            duration: 5000,
            panelClass: ['success-snackbar']
          }
        );
        
        // Update the event end time using the same local time approach
        const startDate = this.createLocalDate(newDateTime);
        const endDate = new Date(startDate.getTime() + 30 * 60000);
        event.setEnd(endDate);
      },
      error: (error) => {
        console.error('Error updating appointment', error);
        this.snackBar.open('Erreur lors de la mise à jour du rendez-vous', 'Fermer', { 
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        // Revert the event to its original position
        event.remove();
        this.loadAppointments(); // Reload all appointments
      }
    });
  }

  handleEventClick(info: EventClickArg): void {
    const appointment = info.event.extendedProps['appointment'];
    if (!appointment) {
      return;
    }

    this.dialog.open(AppointmentDetailsDialogComponent, {
      width: '600px',
      data: {
        appointment: appointment,
        userRole: this.userRole
      }
    });
  }
} 