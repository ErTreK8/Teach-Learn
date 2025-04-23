import { Component, OnInit } from '@angular/core';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app'; // Para inicializar Firebase
import { environment } from '../../environments/environment'; // Configuración de Firebase
import { Usuario } from '../modelsdedades/Usuari'; // Modelo de Usuario
import { Router } from '@angular/router'; // Para navegar entre rutas

@Component({
  selector: 'app-busador-usuario',
  templateUrl: './busador-usuario.component.html',
  styleUrls: ['./busador-usuario.component.css']
})
export class BusadorUsuarioComponent implements OnInit {
  usuarios: Usuario[] = []; // Array para almacenar todos los usuarios obtenidos de Firebase
  filteredUsuarios: Usuario[] = []; // Array para almacenar los usuarios filtrados
  errorMessage: string | null = null;
  searchTerm: string = ''; // Variable para almacenar el término de búsqueda

  constructor(private router: Router) {}

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
      const usersArray: Usuario[] = Object.keys(usersData)
        .map((key) => new Usuario({ idUsr: key, ...usersData[key] }))
        .filter((usuario) => usuario.verified === true); // Filtrar solo usuarios activos
  
      // Guardar los usuarios activos en el array local
      this.usuarios = usersArray;
      this.filteredUsuarios = usersArray; // Inicialmente, mostrar todos los usuarios activos
    } catch (error: any) {
      console.error('Error al cargar usuarios:', error.message || error);
      this.errorMessage = error.message || 'Error al cargar usuarios.';
    }
  }

  // Método para filtrar usuarios
  filterUsers(): void {
    const term = this.searchTerm.toLowerCase().trim(); // Convertir a minúsculas y eliminar espacios
    if (!term) {
      // Si el término de búsqueda está vacío, mostrar todos los usuarios
      this.filteredUsuarios = [...this.usuarios];
    } else {
      // Filtrar usuarios por nombre o correo electrónico
      this.filteredUsuarios = this.usuarios.filter(
        (usuario) =>
          usuario.nombre?.toLowerCase().includes(term) || // Buscar en el nombre
          usuario.email?.toLowerCase().includes(term) // Buscar en el correo electrónico
      );
    }
  }

  // Método para manejar el cambio en el campo de búsqueda
  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value; // Actualizar el término de búsqueda
    this.filterUsers(); // Filtrar usuarios
  }

  // Método para navegar al perfil del usuario
  verPerfil(idUsuario: string): void {
    this.router.navigate(['/perfil', idUsuario]); // Navegar al perfil del usuario
  }
}