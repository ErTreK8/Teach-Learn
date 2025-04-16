import { Component } from '@angular/core';
import { ServeiAutenticarService } from '../servei-autenticar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(public serveiAutenticar: ServeiAutenticarService) {}

  ngOnInit(): void {
    this.serveiAutenticar.loginOK = false;
    localStorage.removeItem("email");
  }

  // Método para manejar el login
  async handleLogin(): Promise<void> {
    try {
      await this.serveiAutenticar.login();
    } catch (error: any) {
      console.error('Error durante el login:', error.message || error);
    }
  }
}