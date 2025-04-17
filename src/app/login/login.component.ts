import { Component } from '@angular/core';
import { ServeiAutenticarService } from '../servei-autenticar.service';
import { Router } from '@angular/router'; // Importa el Router


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(public serveiAutenticar: ServeiAutenticarService, private router: Router) {}

  ngOnInit(): void {
    this.serveiAutenticar.loginOK = false;
    localStorage.removeItem("email");
  }

  // Método para manejar el login
  async handleLogin(): Promise<void> {
    try {
      await this.serveiAutenticar.login();
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error durante el login:', error.message || error);
    }
  }
}