import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarOptions, EventApi, EventDropArg, EventClickArg } from '@fullcalendar/core';
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

@Component({
  selector: 'app-appointment-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatSnackBarModule,
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="calendar-container">
      <full-calendar #calendar [options]="calendarOptions"></full-calendar>
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
  `]
})
export class AppointmentCalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: any;
  @Input() userRole: 'doctor' | 'secretaire' = 'doctor';
  calendarEvents: any[] = [];
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
    private authService: AuthService
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

  loadAppointments(): void {
    const appointmentObservable = this.userRole === 'doctor' 
      ? this.appointmentService.getMyDoctorAppointments()
      : this.appointmentService.getMySecretaryAppointments();

    appointmentObservable.subscribe({
      next: (appointments) => {
        this.calendarEvents = appointments.map(appointment => {
          const eventColor = this.getStatusColor(appointment.status);
          return {
            id: appointment.id,
            title: this.createEventTitle(appointment),
            start: appointment.appointmentDateTime,
            end: this.calculateEndTime(appointment.appointmentDateTime),
            backgroundColor: eventColor.background,
            borderColor: eventColor.border,
            textColor: eventColor.text,
            extendedProps: {
              status: appointment.status,
              appointment: appointment
            }
          };
        });
        
        // Update calendar events
        if (this.calendarComponent && this.calendarComponent.getApi) {
          const calendarApi = this.calendarComponent.getApi();
          calendarApi.removeAllEvents();
          calendarApi.addEventSource(this.calendarEvents);
        } else {
          this.calendarOptions.events = this.calendarEvents;
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

  createEventTitle(appointment: Appointment): string {
    const patientName = appointment.patient 
      ? `${appointment.patient.prenom} ${appointment.patient.nom}`
      : 'Patient inconnu';
    
    const appointmentType = appointment.appointmentType || '';
    return `${patientName} - ${appointmentType}`;
  }

  calculateEndTime(startTimeStr: string): string {
    const startTime = new Date(startTimeStr);
    const endTime = new Date(startTime.getTime() + 30 * 60000); // Add 30 minutes
    return endTime.toISOString();
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
    const newDateTime = event.start?.toISOString();

    if (!appointmentId || !newDateTime) {
      this.snackBar.open('Impossible de mettre à jour le rendez-vous', 'Fermer', { duration: 3000 });
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
      this.snackBar.open('Impossible de modifier ce rendez-vous en raison de son statut', 'Fermer', { duration: 3000 });
      info.revert();
      return;
    }

    // Format date for display
    const formatDate = new Date(newDateTime).toLocaleString('fr-FR', {
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
    const updateMethod = this.userRole === 'doctor'
      ? this.appointmentService.updateAppointmentTimeByDoctor(appointmentId, newDateTime)
      : this.appointmentService.updateAppointmentTimeBySecretary(appointmentId, newDateTime);

    updateMethod.subscribe({
      next: (updatedAppointment) => {
        // Format date for display
        const formattedDate = new Date(newDateTime).toLocaleString('fr-FR', {
          weekday: 'long',
          day: 'numeric', 
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        // Show success message with detailed info
        this.snackBar.open(
          `Rendez-vous reprogrammé avec succès pour le ${formattedDate}. Le patient a été notifié.`, 
          'Fermer', 
          { 
            duration: 5000,
            panelClass: ['success-snackbar']
          }
        );
        
        // Update the event end time
        event.setEnd(new Date(new Date(newDateTime).getTime() + 30 * 60000));
      },
      error: (error) => {
        console.error('Error updating appointment', error);
        this.snackBar.open('Erreur lors de la mise à jour du rendez-vous', 'Fermer', { duration: 3000 });
        // Revert the event to its original position
        event.remove();
        this.loadAppointments(); // Reload all appointments
      }
    });
  }

  handleEventClick(info: EventClickArg): void {
    console.log('Event clicked:', info.event);
    const appointment = info.event.extendedProps['appointment'];
    console.log('Appointment data:', appointment);
    
    if (appointment) {
      this.dialog.open(AppointmentDetailsDialogComponent, {
        width: '800px',
        data: appointment,
        panelClass: 'appointment-details-dialog'
      });
    }
  }
} 