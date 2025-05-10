import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    FormsModule,
    RouterModule,
    MatProgressSpinnerModule
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  rememberMe = false;
  loginError: string | null = null;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est déjà authentifié et le rediriger vers son dashboard
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getUserRole();
      if (role) {
        this.router.navigate([`/dashboard/${role.toLowerCase()}`]);
      }
    }
    
    this.loginForm.valueChanges.subscribe(value => {
      console.log('Form value:', value);
      console.log('Form valid:', this.loginForm.valid);
      console.log('Email errors:', this.loginForm.get('email')?.errors);
      console.log('Password errors:', this.loginForm.get('password')?.errors);
      console.log('Form status:', this.loginForm.status);
      console.log('Form touched:', this.loginForm.touched);
      console.log('Form dirty:', this.loginForm.dirty);
    });
  }

  goToSignIn(): void {
    this.router.navigate(['/sign-in']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginError = null;
      this.isLoading = true;
      
      const credentials = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };
      
      this.authService.authenticate(credentials).subscribe({
        next: (response: any) => {
          console.log('Full authentication response:', response);
          const role = response.role?.toLowerCase(); // Convert role to lowercase
          console.log('Extracted role (lowercase):', role);
          
          if (!role) {
            console.error('No role received from backend');
            this.loginError = "Erreur: Aucun rôle utilisateur reçu du serveur";
            this.snackBar.open("Erreur d'authentification: veuillez contacter l'administrateur", "Fermer", {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
            this.isLoading = false;
            return;
          }

          // Define valid roles
          const validRoles = ['doctor', 'admin', 'patient', 'secretaire', 'fournisseur', 'pharmacie', 'labo'];
          
          if (!validRoles.includes(role)) {
            console.error('Invalid role received:', role);
            this.loginError = "Erreur: Rôle utilisateur non reconnu";
            this.snackBar.open("Erreur d'authentification: rôle non reconnu", "Fermer", {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
            this.isLoading = false;
            return;
          }

          // Réinitialiser les erreurs et afficher un message de succès
          this.loginError = null;
          this.snackBar.open("Connexion réussie", "Fermer", {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          
          const dashboardPath = `/dashboard/${role}`;
          console.log('Navigating to:', dashboardPath);
          this.router.navigate([dashboardPath]);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login failed', error);
          this.isLoading = false;
          
          // Gérer différents types d'erreurs
          if (error.status === 401) {
            // Vérifier si le message d'erreur précise le type d'erreur
            if (error.error && error.error.message) {
              if (error.error.message.includes('mot de passe incorrect') || error.error.message.includes('incorrect password')) {
                this.loginError = "Mot de passe incorrect. Veuillez réessayer ou utiliser la récupération de mot de passe.";
                const snackBarRef = this.snackBar.open("Mot de passe incorrect", "Mot de passe oublié?", {
                  duration: 8000,
                  panelClass: ['warning-snackbar']
                });
                
                snackBarRef.onAction().subscribe(() => {
                  this.goToForgotPassword();
                });
              } else if (error.error.message.includes('utilisateur non trouvé') || error.error.message.includes('user not found')) {
                this.loginError = "Aucun compte n'est associé à cet email. Veuillez vérifier votre email ou créer un compte.";
                const snackBarRef = this.snackBar.open("Compte inexistant", "Créer un compte", {
                  duration: 8000,
                  panelClass: ['warning-snackbar']
                });
                
                snackBarRef.onAction().subscribe(() => {
                  this.goToSignIn();
                });
              } else {
                this.loginError = "Identifiants incorrects. Veuillez vérifier votre email et mot de passe.";
                this.snackBar.open("Identifiants incorrects", "Fermer", {
                  duration: 5000,
                  panelClass: ['error-snackbar']
                });
              }
            } else {
              this.loginError = "Identifiants incorrects. Veuillez vérifier votre email et mot de passe.";
              this.snackBar.open("Identifiants incorrects", "Fermer", {
                duration: 5000,
                panelClass: ['error-snackbar']
              });
            }
          } else if (error.status === 403) {
            this.loginError = "Votre compte n'est pas activé. Veuillez vérifier votre email pour le lien d'activation.";
            const snackBarRef = this.snackBar.open("Compte non activé", "Activer maintenant", {
              duration: 8000,
              panelClass: ['warning-snackbar']
            });
            
            snackBarRef.onAction().subscribe(() => {
              this.router.navigate(['/activate-account']);
            });
          } else if (error.status === 429) {
            this.loginError = "Trop de tentatives de connexion. Veuillez réessayer plus tard ou réinitialiser votre mot de passe.";
            const snackBarRef = this.snackBar.open("Trop de tentatives", "Réinitialiser mot de passe", {
              duration: 8000,
              panelClass: ['error-snackbar']
            });
            
            snackBarRef.onAction().subscribe(() => {
              this.goToForgotPassword();
            });
          } else if (error.status === 0) {
            this.loginError = "Impossible de communiquer avec le serveur. Veuillez vérifier votre connexion internet et réessayer.";
            this.snackBar.open("Erreur de connexion au serveur", "Réessayer", {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          } else {
            this.loginError = "Erreur lors de la connexion. Veuillez réessayer plus tard.";
            this.snackBar.open("Erreur de connexion", "Fermer", {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  loginWithGoogle() {
    // Implémentez la logique de connexion avec Google ici
  }

  loginWithApple() {
    // Implémentez la logique de connexion avec Apple ici
  }

  loginWithFacebook() {
    // Implémentez la logique de connexion avec Facebook ici
  }
}