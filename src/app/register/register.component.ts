import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { getDatabase, ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid'; // Para generar un ID único para el usuario
import { EmailVerificationService } from '../email-verification.service'; // Servicio personalizado para enviar correos

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
    console.log('Botón de registro presionado');

    if (this.registerForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;

    const userId = uuidv4();
    const verificationCode = Math.random().toString(36).substr(2, 8);

    const db = getDatabase();
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

    set(usersRef, userData)
      .then(() => {
        console.log('Datos del usuario guardados en el Realtime Database');

        this.emailVerificationService.sendEmailVerificationCode(email, verificationCode)
          .then(() => {
            alert('Se ha enviado un código de verificación a tu correo electrónico.');
            this.router.navigate(['/verify-email'], { queryParams: { userId } });
          })
          .catch((error) => {
            this.errorMessage = 'Error al enviar el correo de verificación.';
          });
      })
      .catch((error) => {
        this.errorMessage = 'Error al guardar los datos del usuario.';
      });
  }
}