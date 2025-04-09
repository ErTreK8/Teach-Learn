import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../environments/environment';
import { EmailVerificationService } from '../email-verification.service';
import { Usuario } from '../modelsdedades/Usuari'; // Importa la clase Usuario

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

    if (!getApps().length) {
      console.log('Inicializando Firebase...');
      initializeApp(environment.fireBaseConfig);
      console.log('Firebase inicializado correctamente.');
    }
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

    console.log('Intentando registrar usuario con correo:', email);

    const db = getDatabase();
    const usersRef = ref(db, 'Usuario');

    // Obtener todos los usuarios
    console.log('Obteniendo todos los usuarios de la base de datos...');
    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersArray: Usuario[] = Object.keys(usersData).map((key) => new Usuario({ idUsr: key, ...usersData[key] }));

          // Verificar si el correo ya existe
          const existingUser = usersArray.find((user) => user.email === email);
          if (existingUser) {
            console.error('El correo ya está registrado en la base de datos.');
            this.errorMessage = 'Ya existe una cuenta con este correo electrónico.';
            throw new Error('Correo duplicado');
          }
        }

        console.log('El correo no existe en la base de datos. Procediendo con el registro...');

        const userId = uuidv4();
        const verificationCode = Math.random().toString(36).substr(2, 8);

        const auth = getAuth();

        // Autenticación Anónima
        console.log('Iniciando autenticación anónima...');
        return signInAnonymously(auth).then(() => ({ userId, verificationCode }));
      })
      .then(({ userId, verificationCode }) => {
        console.log('Usuario autenticado anónimamente.');

        // Guardar los datos del usuario en la base de datos
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

        console.log('Guardando datos del usuario en la base de datos...');
        return set(ref(db, `Usuario/${userId}`), userData).then(() => ({ userId, verificationCode, email }));
      })
      .then(({ userId, verificationCode, email }) => {
        console.log('Datos del usuario guardados en el Realtime Database.');

        // Enviar el código de verificación al correo electrónico
        console.log('Enviando código de verificación por correo electrónico...');
        return this.emailVerificationService.sendEmailVerificationCode(email, verificationCode).then(() => userId);
      })
      .then((userId) => {
        console.log('Código de verificación enviado correctamente.');
        alert('Se ha enviado un código de verificación a tu correo electrónico.');
        this.router.navigate(['/verify-email'], { queryParams: { userId } });
      })
      .catch((error) => {
        console.error('Error durante el registro:', error);
        if (error.message.includes('Correo duplicado')) {
          this.errorMessage = 'Ya existe una cuenta con este correo electrónico.';
        } else {
          this.errorMessage = 'Error al registrar el usuario.';
        }
      });
  }
}