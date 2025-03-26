import { Component } from '@angular/core';
import { ServeiAutenticarService } from '../servei-autenticar.service';
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

  constructor(private serveiAutenticar: ServeiAutenticarService) {}

  register(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.serveiAutenticar.register(this.email, this.password)
      .then(() => {
        console.log('Registro exitoso');
        // Redirigir al login o mostrar un mensaje de éxito
      })
      .catch((error) => {
        console.error('Error al registrar:', error.message);
        this.errorMessage = error.message;
      });
  }
}
