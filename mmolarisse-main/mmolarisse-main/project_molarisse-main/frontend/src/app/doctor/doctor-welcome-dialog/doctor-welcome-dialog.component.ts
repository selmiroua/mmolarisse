import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileService } from '../../profile/profile.service';
import { firstValueFrom } from 'rxjs';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-doctor-welcome-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule
  ],
  templateUrl: './doctor-welcome-dialog.component.html',
  styleUrls: ['./doctor-welcome-dialog.component.scss']
})
export class DoctorWelcomeDialogComponent {
  currentStep = 1;
  doctorForm: FormGroup;
  specialites = [
    'Orthodontie', 'Parodontie', 'Endodontie', 'Chirurgie orale', 'Prothèse dentaire',
    'Odontologie pédiatrique', 'Implantologie', 'Dentisterie esthétique', 'Autre'
  ];
  villes = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Sfax', 'Sousse', 'Monastir', 'Nabeul', 'Bizerte', 'Gabès', 'Autre'
  ];
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<DoctorWelcomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userName: string },
    private fb: FormBuilder,
    private profileService: ProfileService,
    private snackBar: MatSnackBar
  ) {
    this.doctorForm = this.fb.group({
      specialite: ['', Validators.required],
      ville: ['', Validators.required],
      cabinetAdresse: ['', Validators.required],
      rpps: ['', Validators.required]
    });
  }

  nextStep() {
    this.currentStep = 2;
  }

  async finish() {
    if (this.doctorForm.valid) {
      try {
        // First update the profile data
        const profileData = {
          specialities: [this.doctorForm.value.specialite],
          ville: this.doctorForm.value.ville,
          cabinetAdresse: this.doctorForm.value.cabinetAdresse,
          orderNumber: this.doctorForm.value.rpps
        };

        // Log the form values and profile data being sent
        console.log('Form values:', this.doctorForm.value);
        console.log('Profile data being sent:', profileData);

        await firstValueFrom(this.profileService.updateProfile(profileData));

        // Then upload the profile picture if one was selected
        if (this.selectedFile) {
          const upload$ = this.profileService.uploadProfilePicture(this.selectedFile);
          await firstValueFrom(upload$);
        }

        localStorage.setItem('welcomeBannerSeen', 'true');

        this.snackBar.open('Profil mis à jour avec succès', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.dialogRef.close(this.doctorForm.value);

      } catch (error) {
        console.error('Error updating profile:', error);
        this.snackBar.open('Erreur lors de la mise à jour du profil', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result ?? null;
      };
      reader.readAsDataURL(file);
    }
  }
} 