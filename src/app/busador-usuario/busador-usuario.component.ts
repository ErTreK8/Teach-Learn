import { Component, OnInit } from '@angular/core';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app'; // Para inicializar Firebase
import { environment } from '../../environments/environment'; // Configuración de Firebase
import { Usuario } from '../modelsdedades/Usuari'; // Modelo de Usuario

@Component({
  selector: 'app-busador-usuario',
  templateUrl: './busador-usuario.component.html',
  styleUrls: ['./busador-usuario.component.css']
})
export class BusadorUsuarioComponent implements OnInit {
  usuarios: Usuario[] = []; // Array para almacenar los usuarios obtenidos de Firebase
  errorMessage: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.cargarUsuariosDesdeFirebase();
  }

  // Método para cargar usuarios desde Firebase
  async cargarUsuariosDesdeFirebase(): Promise<void> {
    try {
      // Inicializa Firebase si no está ya inicializado
      if (!getApps().length) {
        console.log('Inicializando Firebase...');
        initializeApp(environment.fireBaseConfig);
        console.log('Firebase inicializado correctamente.');
      }

      const db = getDatabase(); // Obtener la instancia de la base de datos
      const usersRef = ref(db, 'Usuario'); // Referencia al nodo "Usuario"

      // Obtener todos los usuarios de la base de datos
      const snapshot = await get(usersRef);

      if (!snapshot.exists()) {
        throw new Error('No hay usuarios registrados en la base de datos.');
      }

      const usersData = snapshot.val(); // Datos sin procesar
      const usersArray: Usuario[] = Object.keys(usersData).map((key) => new Usuario({ idUsr: key, ...usersData[key] }));

      // Guardar los usuarios en el array local
      this.usuarios = usersArray;
    } catch (error: any) {
      console.error('Error al cargar usuarios:', error.message || error);
      this.errorMessage = error.message || 'Error al cargar usuarios.';
    }
  }
}