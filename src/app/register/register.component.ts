import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User } from '../modelsdedades/nweUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Ojo a la referencia a los estilos
})

export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private db: AngularFireDatabase) {}

  register(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const userId = this.generateUserId(); // Genera un ID único para el usuario
    const userData = {
      email: this.email,
      password: this.password, // Nota: No es seguro guardar contraseñas en texto plano
    };

    this.db.object(`/Usuario/${userId}`).set(userData)
      .then(() => {
        console.log('Usuario registrado con éxito en Realtime Database:', userData);
        // Redirigir al login o mostrar un mensaje de éxito
      })
      .catch((error) => {
        console.error('Error al registrar el usuario en Realtime Database:', error.message);
        this.errorMessage = 'Error al registrar el usuario. Inténtalo de nuevo.';
      });
  }

  // Método para generar un ID único para el usuario
  private generateUserId(): string {
    return Math.random().toString(36).substr(2, 9); // Genera un ID aleatorio
  }
}
