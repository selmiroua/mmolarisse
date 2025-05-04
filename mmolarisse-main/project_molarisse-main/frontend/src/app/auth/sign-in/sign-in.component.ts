import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface RoleOption {
  value: string;
  displayName: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatRippleModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  signInForm: FormGroup;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  roleOptions: RoleOption[] = [];
  registerError: string | null = null;
  isLoading: boolean = false;
  selectedRole: string | null = null;

  // Liste des rôles avec leurs icônes et descriptions
  private roleIcons: Record<string, RoleOption> = {
    'patient': {
      value: 'patient',
      displayName: 'Patient',
      icon: 'person',
      description: 'Un compte pour les patients'
    },
    'doctor': {
      value: 'doctor',
      displayName: 'Médecin',
      icon: 'medical_services',
      description: 'Un compte pour les médecins et professionnels de santé'
    },
    'secretaire': {
      value: 'secretaire',
      displayName: 'Secrétaire',
      icon: 'content_paste',
      description: 'Un compte pour le personnel administratif'
    },
    'pharmacie': {
      value: 'pharmacie',
      displayName: 'Pharmacie',
      icon: 'local_pharmacy',
      description: 'Un compte pour les pharmacies'
    },
    'labo': {
      value: 'labo',
      displayName: 'Laboratoire',
      icon: 'science',
      description: 'Un compte pour les laboratoires d\'analyse'
    },
    'fournisseur': {
      value: 'fournisseur',
      displayName: 'Fournisseur',
      icon: 'inventory_2',
      description: 'Un compte pour les fournisseurs de matériel médical'
    }
  };

  // List of roles that should not be available for registration
  private restrictedRoles: string[] = ['Admin'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.signInForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });

    this.authService.getRoles().subscribe({
      next: (roles) => {
        // Filter out restricted roles
        const availableRoles = roles.filter(role => !this.restrictedRoles.includes(role));
        console.log('Available roles for registration:', availableRoles);
        
        // Créer les options de rôle avec icônes
        this.roleOptions = availableRoles
          .filter(role => this.roleIcons[role.toLowerCase()]) // S'assurer que le rôle a une configuration d'icône
          .map(role => this.roleIcons[role.toLowerCase()]);
      },
      error: (error) => {
        console.error('Error loading roles', error);
        this.registerError = "Erreur lors du chargement des rôles. Veuillez réessayer.";
        this.snackBar.open("Erreur de chargement", "Fermer", {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  selectRole(role: string): void {
    this.selectedRole = role;
    this.signInForm.get('role')?.setValue(role);
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.signInForm.controls).forEach(key => {
        this.signInForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.registerError = null;
    const { confirmPassword, ...userData } = this.signInForm.value;
    console.log('Submitting form with user data:', userData);
    
    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isLoading = false;
        this.snackBar.open("Inscription réussie! Veuillez vérifier votre email pour activer votre compte.", "Fermer", {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/activate-account']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Registration failed', error);
        this.isLoading = false;
        
        if (error.status === 409 || (error.error && error.error.message && error.error.message.includes('existe déjà'))) {
          this.registerError = "Un compte existe déjà avec cette adresse email. Veuillez vous connecter ou utiliser une autre adresse email.";
          const snackBarRef = this.snackBar.open("Email déjà utilisé", "Se connecter", {
            duration: 8000,
            panelClass: ['warning-snackbar']
          });
          
          snackBarRef.onAction().subscribe(() => {
            this.goToLogin();
          });
        } else if (error.status === 400) {
          if (error.error && error.error.message) {
            // Message d'erreur spécifique du serveur
            this.registerError = error.error.message;
          } else if (error.error && typeof error.error === 'string') {
            this.registerError = error.error;
          } else {
            this.registerError = "Les informations fournies sont invalides. Veuillez vérifier les champs et réessayer.";
          }
          this.snackBar.open(this.registerError || "Erreur d'inscription", "Fermer", {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        } else if (error.status === 0) {
          this.registerError = "Impossible de communiquer avec le serveur. Veuillez vérifier votre connexion internet et réessayer.";
          this.snackBar.open(this.registerError, "Réessayer", {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        } else {
          this.registerError = "Une erreur inattendue est survenue lors de l'inscription. Veuillez réessayer ultérieurement.";
          this.snackBar.open(this.registerError, "Fermer", {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      }
    });
  }

  signInWithGoogle() {
    // Implement Google sign-in
  }

  signInWithApple() {
    // Implement Apple sign-in
  }

  signInWithFacebook() {
    // Implement Facebook sign-in
  }
}
