import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database'; // Importa getDatabase aquí
import { v4 as uuidv4 } from 'uuid';
import { EmailVerificationService } from '../email-verification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private emailVerificationService: EmailVerificationService
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.matchPassword('password', 'confirmPassword')
    });
  }

  matchPassword(passwordKey: string, confirmPasswordKey: string) {
    return (formGroup: FormGroup) => {
      const password = formGroup.controls[passwordKey];
      const confirmPassword = formGroup.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ mismatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
    };
  }

  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }

  register(): void {
    if (this.registerForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;

    const userId = uuidv4();
    const verificationCode = Math.random().toString(36).substr(2, 8);

    // Obtener la instancia de Firebase Auth
    const auth = getAuth();

    // Autenticación Anónima
    signInAnonymously(auth)
      .then(() => {
        console.log('Usuario autenticado anónimamente');

        // Obtener la instancia de la base de datos
        const db = getDatabase();

        // Guardar los datos del usuario en el Realtime Database
        const usersRef = ref(db, `Usuario/${userId}`);

        const userData = {
          idUsr: userId,
          email,
          password, // Asegúrate de cifrar esto en producción
          esAdmin: false,
          fotoPerfil: '',
          descripcion: '',
          verified: false,
          verificationCode
        };

        return set(usersRef, userData); // Guarda los datos
      })
      .then(() => {
        console.log('Datos del usuario guardados en el Realtime Database');

        // Enviar el código de verificación al correo electrónico
        return this.emailVerificationService.sendEmailVerificationCode(email, verificationCode);
      })
      .then(() => {
        alert('Se ha enviado un código de verificación a tu correo electrónico.');
        this.router.navigate(['/verify-email'], { queryParams: { userId } });
      })
      .catch((error) => {
        console.error('Error durante el registro:', error);
        this.errorMessage = 'Error al registrar el usuario.';
      });
  }
}