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
  registerForm: FormGroup;
  errorMessage: string | null = null;

  // Estado actual de la vista
  currentView: 'login' | 'register' = 'login';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Formulario de inicio de sesión
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Formulario de registro
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      type: ['pasajero', Validators.required], // Por defecto, es 'passenger'
      carDetails: this.fb.group({
        placa: [''],
        marca: [''],
        modelo: [''],
        color: [''],
        capacidad: [''],
      }),
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response: any) => {
          if (response?.user?.tipo_usuario) {
            const token = response.user.id_usuario;
            const role = response.user.tipo_usuario;
            const name = response.user.nombre;

            this.authService.saveSession(token, role, name);
            this.router.navigate([`/${role}`]);
          } else {
            this.errorMessage = 'Unexpected response structure.';
          }
        },
        error: () => {
          this.errorMessage = 'Invalid credentials, please try again.';
        },
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }

  onRegister(): void {
    console.log("estoy en onregister");
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log("fui valido");
      console.log("car details", formData.carDetails.plate);

      // Si el tipo es 'passenger', limpiamos los detalles del auto
      if (formData.type === 'pasajero') {
        console.log("soy pasajero");
        // formData.carDetails = null;
      }

      console.log("car details", formData.carDetails.plate);

      this.authService.register(formData).subscribe({
        next: () => {
          console.log("RESGIST SUCCESS");
          alert('Registration successful!');
          this.toggleView('login');
        },
        error: (error) => {
          console.log("NOSE");
          console.error('Error during registration:', error);
          this.errorMessage = 'There was an error during registration.';
        },
      });
    } else {
      console.log("NOFUIVALIOD");
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }

  toggleView(view: 'login' | 'register'): void {
    this.currentView = view;
  }

  isDriver(): boolean {
    return this.registerForm.get('type')?.value === 'conductor';
  }
}
