import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, ref, get, update } from 'firebase/database';
import { initializeApp, getApps } from 'firebase/app';
import { environment } from '../../environments/environment';
import { Clase } from '../modelsdedades/Clase'; // Modelo de Clase
import { ResenyaClase } from '../modelsdedades/ResenyaClase'; // Modelo de Reseña de Clase
import { Resenya } from '../modelsdedades/Resenya'; // Modelo de Reseña
import { Usuario } from '../modelsdedades/Usuari'; // Modelo de Usuario

@Component({
  selector: 'app-perfil-propio',
  templateUrl: './perfil-propio.component.html',
  styleUrls: ['./perfil-propio.component.css']
})
export class PerfilPropioComponent implements OnInit {
  idUsuario: string | null = null;
  nombre: string = '';
  apellido: string = '';
  fotoPerfil: string = ''; // Inicialmente vacía
  descripcion: string = '';
  resenas: any[] = [];
  modoEdicion: boolean = false;
  nuevaDescripcion: string = '';
  notaMedia: number = 0;
  teachCoins: number = 0;

  HayResenas: boolean = false;
  PerfilPropio: boolean = false;
  modoProfesor: boolean = false; // Nueva propiedad para el modo profesor

  fotoPerfilOriginal: string = ''; // Copia temporal de la foto de perfil

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Escuchar cambios en los parámetros de la ruta
    this.route.paramMap.subscribe((params) => {
      this.idUsuario = params.get('idUsuario'); // Obtener el ID del usuario desde la URL
      const userIdActual = localStorage.getItem('idUsr');

      // Detectar si el modo profesor está activado
      const modoProfesor = localStorage.getItem('modoProfesor');
      this.modoProfesor = modoProfesor === 'true'; // Convertir a booleano

      // Detectar si es el perfil propio
      this.PerfilPropio = userIdActual === this.idUsuario;

      // Cargar los datos del perfil
      this.cargarDatosPerfil();
    });
  }

  iniciarChat(): void {
    const idUsuarioActual = localStorage.getItem('idUsr');
    if (idUsuarioActual !== this.idUsuario) {
      this.router.navigate(['/chat'], { queryParams: { idContacto: this.idUsuario } });
    }
  }

  async cargarDatosPerfil(): Promise<void> {
    try {
      if (!this.idUsuario) {
        throw new Error('ID de usuario no encontrado.');
      }

      if (!getApps().length) {
        initializeApp(environment.fireBaseConfig);
      }

      const db = getDatabase();

      // Limpiar los datos anteriores
      this.nombre = '';
      this.apellido = '';
      this.fotoPerfil = '';
      this.descripcion = '';
      this.teachCoins = 0;
      this.resenas = [];
      this.HayResenas = false;
      this.notaMedia = 0;

      // Cargar datos básicos del usuario
      const userRef = ref(db, `Usuario/${this.idUsuario}`);
      const userSnap = await get(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.val() as Usuario; // Usamos el modelo Usuario
        this.nombre = userData.nombre || 'Sin nombre';
        this.apellido = userData.apellido || 'Sin apellido';
        this.fotoPerfil = userData.fotoPerfil || ''; // Cargar foto de perfil
        this.descripcion = userData.descripcion || 'Sin descripción.';
        this.teachCoins = userData.teachCoins || 0; // Cargar TeachCoins
      }

      // Obtener clases impartidas por el profesor
      const clasesRef = ref(db, 'Classes');
      const clasesSnap = await get(clasesRef);

      if (clasesSnap.exists()) {
        const clasesData = clasesSnap.val();
        const clasesImpartidas = Object.values(clasesData).filter(
          (clase: any): clase is Clase => clase.idProfesor === this.idUsuario
        );

        const resenasCompletas: any[] = [];

        for (const clase of clasesImpartidas) {
          const idClase = clase.idClass;

          // Buscar reseñas asociadas a esta clase
          const resenasClaseRef = ref(db, 'ResenyasClase');
          const resenasClaseSnap = await get(resenasClaseRef);

          if (resenasClaseSnap.exists()) {
            const resenasClaseData = resenasClaseSnap.val();
            const resenasDeEstaClase = Object.values(resenasClaseData).filter(
              (rc: any): rc is ResenyaClase => rc.idClase === idClase
            );

            for (const resenaClase of resenasDeEstaClase) {
              const idAutor = resenaClase.idUsuario;
              const idResenya = resenaClase.idResenya;

              // Obtener datos del autor
              const autorSnap = await get(ref(db, `Usuario/${idAutor}`));
              const autorData = autorSnap.exists()
                ? autorSnap.val() as Usuario // Usamos el modelo Usuario
                : { nombre: 'Anónimo', apellido: '', fotoPerfil: '' };

              // Obtener datos de la reseña
              const resenaSnap = await get(ref(db, `Resenyas/${idResenya}`));
              if (resenaSnap.exists()) {
                const resenaData = resenaSnap.val() as Resenya; // Usamos el modelo Reseña

                // Añadir el título y la fecha de fin de la clase
                resenasCompletas.push({
                  tituloClase: clase.titulo, // Título de la clase
                  fechaFinClase: clase.dataFi, // Fecha de fin de la clase
                  autorNombre: `${autorData.nombre} ${autorData.apellido}`,
                  autorFoto: autorData.fotoPerfil || '',
                  comentario: resenaData.Resenya,
                  nota: resenaData.Nota
                });
              }
            }
          }
        }

        this.resenas = resenasCompletas;
        this.HayResenas = this.resenas.length > 0;

        // Calcular la nota media
        if (this.resenas.length > 0) {
          const sumaNotas = this.resenas.reduce((total, resena) => total + resena.nota, 0);
          this.notaMedia = sumaNotas / this.resenas.length;
        }
      }
    } catch (error: any) {
      console.error('Error al cargar perfil o reseñas:', error.message);
      alert('Error al cargar el perfil. Por favor, intenta de nuevo.');
    }
  }

  activarModoEdicion(): void {
    this.modoEdicion = true;
    this.nuevaDescripcion = this.descripcion;

    // Guardar una copia de la foto de perfil actual
    this.fotoPerfilOriginal = this.fotoPerfil;
  }

  async guardarCambios(): Promise<void> {
    try {
      const db = getDatabase();
      const userRef = ref(db, `Usuario/${this.idUsuario}`);

      // Actualizar solo los campos modificados
      await update(userRef, {
        nombre: this.nombre,
        apellido: this.apellido,
        fotoPerfil: this.fotoPerfil,
        descripcion: this.nuevaDescripcion
      });

      alert('Cambios guardados.');
      this.descripcion = this.nuevaDescripcion;
      this.modoEdicion = false;
    } catch (error: any) {
      console.error('Error al guardar:', error.message);
      alert('Error al guardar los cambios.');
    }
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.nuevaDescripcion = this.descripcion;

    // Restaurar la foto de perfil a su valor original
    this.fotoPerfil = this.fotoPerfilOriginal;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPerfil = reader.result as string; // Actualizar foto de perfil
      };
      reader.readAsDataURL(file); // Leer archivo como Base64
    }
  }
}