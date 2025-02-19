import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; // Importa firebase para usar GoogleAuthProvider
import 'firebase/compat/auth';
import { Router } from '@angular/router'; // Importa Router para redireccionar después del login
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class ServeiAutenticarService {
  loginOK = false; // Indica si el usuario está logueado
  usuari: any; // Almacena los datos del usuario logueado
  email = ''; // Almacena el email del usuario
  psw = ''; // Almacena la contraseña del usuario

  constructor(public auth: AngularFireAuth, private router: Router) {}

  // Método para iniciar sesión con email y contraseña
  login() {
    return this.auth
      .signInWithEmailAndPassword(this.email, this.psw)
      .then((user) => {
        console.log('Usuario:', user);
        this.usuari = user;
        this.usuari.email = this.email;
        this.psw = ''; // Limpia la contraseña por seguridad
        this.loginOK = true;

        // Guarda el nombre de usuario en el localStorage
        if (user.user) {
          localStorage.setItem('username', user.user.displayName || this.email);
        }

        // Redirige al usuario después del login
        this.router.navigate(['/dashboard']); // Cambia '/dashboard' por la ruta que desees
      })
      .catch((error) => {
        console.error('Error en el login:', error.message);
        this.loginOK = false;
      });
  }

  // Método para cerrar sesión
  logout() {
    this.auth
      .signOut()
      .then(() => {
        console.log('Sesión cerrada correctamente');
        this.email = '';
        this.psw = '';
        this.usuari = null;
        this.loginOK = false;

        // Elimina el nombre de usuario del localStorage
        localStorage.removeItem('username');

        // Redirige al usuario a la página de login
        this.router.navigate(['./']); // Cambia '/login' por la ruta que desees
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error.message);
      });
  }

  // Método para registrar un nuevo usuario con email y contraseña
  register(email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        console.log('Usuario registrado:', user);
        this.usuari = user;
        this.usuari.email = email;
        this.loginOK = true;

        // Guarda el nombre de usuario en el localStorage
        if (user.user) {
          localStorage.setItem('username', user.user.displayName || email);
        }

        // Redirige al usuario después del registro
        this.router.navigate(['/dashboard']); // Cambia '/dashboard' por la ruta que desees
      })
      .catch((error) => {
        console.error('Error en el registro:', error.message);
        this.loginOK = false;
      });
  }
}