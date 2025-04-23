import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import { environment } from '../../environments/environment';
import { EmailVerificationService } from '../email-verification.service';
import { Usuario } from '../modelsdedades/Usuari'; // Importa la clase Usuario
import * as bcrypt from 'bcryptjs'; // Cambia esto

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
      confirmPassword: ['', Validators.required],
      nombre: ['', Validators.required], // Campo obligatorio
      apellido: [''], // Campo opcional
      descripcion: [''] // Campo opcional
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
  get nombre() { return this.registerForm.get('nombre'); } // Agrega getter para el nombre

  async register(): Promise<void> {
    if (this.registerForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const nombre = this.registerForm.value.nombre; // Campo obligatorio
    const apellido = this.registerForm.value.apellido || null; // Campo opcional
    const descripcion = this.registerForm.value.descripcion || null; // Campo opcional

    console.log('Intentando registrar usuario con correo:', email);

    const db = getDatabase();
    const usersRef = ref(db, 'Usuario');

    // Obtener todos los usuarios
    console.log('Obteniendo todos los usuarios de la base de datos...');
    try {
      const snapshot = await get(usersRef);

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

      // Cifrar la contraseña usando bcrypt
      const hashedPassword = await bcrypt.hash(password, 10); // 10 es el costo del hash

      const userId = uuidv4();
      const verificationCode = Math.random().toString(36).substr(2, 8);

      // Guardar los datos del usuario en la base de datos
      const userData = {
        idUsr: userId,
        email,
        password: hashedPassword, // Guardar la contraseña cifrada
        esAdmin: false,
        fotoPerfil: '', // Por defecto, vacío
        descripcion: descripcion,
        verified: false,
        verificationCode,
        nombre: nombre,
        apellido: apellido,
        teachCoins: 0 // Añadir el campo TeachCoins con valor inicial 0
      };

      console.log('Guardando datos del usuario en la base de datos...');
      await set(ref(db, `Usuario/${userId}`), userData);

      console.log('Datos del usuario guardados en el Realtime Database.');

      // Enviar el código de verificación al correo electrónico
      console.log('Enviando código de verificación por correo electrónico...');
      await this.emailVerificationService.sendEmailVerificationCode(email, verificationCode);

      console.log('Código de verificación enviado correctamente.');
      alert('Se ha enviado un código de verificación a tu correo electrónico.');
      this.router.navigate(['/verify-email'], { queryParams: { userId } });
    } catch (error: any) {
      console.error('Error durante el registro:', error.message || error);
      if (error.message.includes('Correo duplicado')) {
        this.errorMessage = 'Ya existe una cuenta con este correo electrónico.';
      } else {
        this.errorMessage = 'Error al registrar el usuario.';
      }
    }
  }
}