import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log("toy en el submit");
      console.log('contrasena', password);
      console.log('usuario', email);
      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          console.log('Respuesta completa:', response);
          if (response?.user?.type) {
            const token = response.user.id; // Puedes usar el ID como token o adaptarlo
            const role = response.user.type; // Esto será "driver" o "passenger"
            
            // Guarda la sesión
            this.authService.saveSession(token, role);

            // Redirige según el rol
            this.router.navigate([`/${role}`]);
          } else {
          console.error('El JSON no contiene los datos esperados:', response);
          this.errorMessage = 'Unexpected response structure.';
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Invalid credentials, please try again.';
        },
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}