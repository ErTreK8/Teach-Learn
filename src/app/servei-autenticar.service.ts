import { Injectable } from '@angular/core';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app'; // Importa initializeApp y funciones auxiliares
import { environment } from './../environments/environment'; // Importa las credenciales de Firebase
import { Usuario } from './modelsdedades/Usuari'; // Importa la clase Usuario
import { Router } from '@angular/router'; // Importa el Router

@Injectable({
  providedIn: 'root'
})
export class ServeiAutenticarService {
  email: string = '';
  psw: string = '';
  loginOK: boolean = false;
  usuari: Usuario | null = null;

  constructor(private router: Router) {
    // Inicializa Firebase si no está ya inicializado
    if (!getApps().length) {
      console.log('Inicializando Firebase...');
      initializeApp(environment.fireBaseConfig);
      console.log('Firebase inicializado correctamente.');
    }
  }

  // Método para iniciar sesión
  async login(): Promise<boolean> {
    const db = getDatabase();
    const usersRef = ref(db, 'Usuario');

    try {
      // Obtener todos los usuarios
      const snapshot = await get(usersRef);

      if (!snapshot.exists()) {
        throw new Error('No hay usuarios registrados.');
      }

      // Convertir los datos a un array de objetos Usuario
      const usersData = snapshot.val();
      const usersArray: Usuario[] = Object.keys(usersData).map((key) => new Usuario({ idUsr: key, ...usersData[key] }));

      // Buscar el usuario por correo electrónico
      const user = usersArray.find((u) => u.email === this.email);

      if (!user) {
        throw new Error('El correo electrónico no está registrado.');
      }

      if (user.password !== this.psw) {
        throw new Error('Contraseña incorrecta.');
      }

      if (!user.verified) {
        throw new Error('La cuenta no está verificada.');
      }

      // Guardar datos en localStorage
      localStorage.setItem('email', user.email);
      localStorage.setItem('esAdmin', user.esAdmin.toString());
      localStorage.setItem('fotoPerfil', user.fotoPerfil || '');
      localStorage.setItem('idUsr', user.idUsr);
      localStorage.setItem('verified', user.verified.toString());
      localStorage.setItem('modoProfesor', "false");


      // Redirigir a /home después del login exitoso
      this.usuari = user;
      this.loginOK = true;

      console.log('Inicio de sesión exitoso. Redirigiendo a /home...');
      this.router.navigate(['/home']); // Redirige al usuario a /home

      return true;
    } catch (error: any) {
      console.error('Error durante el login:', error.message || error);
      this.loginOK = false;
      throw error;
    }
  }

  logout(): void {
    this.loginOK = false;
    this.usuari = null;
    localStorage.clear();
  }
}