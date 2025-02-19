import { Component, OnInit } from '@angular/core';
import { ServeiAutenticarService } from '../servei-autenticar.service';
import { Router } from '@angular/router'; // Importa Router para redireccionar al usuario después del login

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public serveiAutenticar: ServeiAutenticarService,
    private router: Router // Inyecta Router en el constructor
  ) { }

  ngOnInit(): void {
    this.serveiAutenticar.loginOK = false;
  }

  // Método para iniciar sesión con email y contraseña
  login() {
    this.serveiAutenticar.login()
      .then(() => {
        this.router.navigate(['/home']); // Cambia '/dashboard' por la ruta que desees
      })
      .catch((error) => {
        console.error('Error en el login:', error);
      });
  }

  // Método para cerrar sesión
  logout() {
    this.serveiAutenticar.logout();
  }
}