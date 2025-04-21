import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getDatabase, ref, set, get } from 'firebase/database';
import { initializeApp, getApps } from 'firebase/app';
import { environment } from '../../environments/environment';
import { ResenyaClase } from '../modelsdedades/ResenyaClase'; // Importamos el modelo

@Component({
  selector: 'app-perfil-propio',
  templateUrl: './perfil-propio.component.html',
  styleUrls: ['./perfil-propio.component.css']
})
export class PerfilPropioComponent implements OnInit {
  idUsuario: string | null = null;
  nombre: string = '';
  apellido: string = '';
  fotoPerfil: string = './img/user.jpg';
  descripcion: string = '';
  resenas: any[] = []; // Cambiamos "reseñas" por "resenas"
  modoEdicion: boolean = false;
  nuevaDescripcion: string = '';

  HayResenas: boolean = false; // Cambiamos "reseñas" por "resenas"
  PerfilPropio: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.idUsuario = this.route.snapshot.paramMap.get('idUsuario');
    const userIdActual = localStorage.getItem('idUsr');

    this.PerfilPropio = userIdActual === this.idUsuario;

    this.cargarDatosPerfil();
  }

  async cargarDatosPerfil(): Promise<void> {
    try {
      if (!getApps().length) initializeApp(environment.fireBaseConfig);
      const db = getDatabase();

      // Cargar datos básicos del usuario
      const userRef = ref(db, `Usuario/${this.idUsuario}`);
      const userSnap = await get(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.val();
        this.nombre = userData.nombre || 'Sin nombre';
        this.apellido = userData.apellido || 'Sin apellido';
        this.fotoPerfil = userData.fotoPerfil || './img/user.jpg';
        this.descripcion = userData.descripcion || 'Sin descripción.';
      }

      // Obtener reseñas relacionadas con clases impartidas
      const resenasClaseRef = ref(db, 'ResenyasClase');
      const resenasClaseSnap = await get(resenasClaseRef);

      if (resenasClaseSnap.exists()) {
        const resenasClaseData = resenasClaseSnap.val();
        const entradas: ResenyaClase[] = Object.values(resenasClaseData).filter(
          (rc: ResenyaClase) => rc.idProfesor === this.idUsuario
        );

        const resenasCompletas: any[] = [];

        for (const entrada of entradas) {
          const idAutor = entrada.idUsuario;
          const idResenya = entrada.idResenya;

          // Obtener datos del autor
          const autorSnap = await get(ref(db, `Usuario/${idAutor}`));
          const autorData = autorSnap.exists()
            ? autorSnap.val()
            : { nombre: 'Anónimo', fotoPerfil: './img/user.jpg' };

          // Obtener datos de la reseña
          const resenaSnap = await get(ref(db, `Resenyas/${idResenya}`));
          if (resenaSnap.exists()) {
            const resenaData = resenaSnap.val();

            resenasCompletas.push({
              autorNombre: autorData.nombre,
              autorFoto: autorData.fotoPerfil || './img/user.jpg',
              comentario: resenaData.Resenya,
              nota: resenaData.Nota
            });
          }
        }

        this.resenas = resenasCompletas; // Cambiamos "reseñas" por "resenas"
        this.HayResenas = this.resenas.length > 0; // Cambiamos "reseñas" por "resenas"
      }
    } catch (error: any) {
      console.error('Error al cargar perfil o reseñas:', error.message);
    }
  }

  activarModoEdicion(): void {
    this.modoEdicion = true;
    this.nuevaDescripcion = this.descripcion;
  }

  async guardarCambios(): Promise<void> {
    try {
      const db = getDatabase();
      const userRef = ref(db, `Usuario/${this.idUsuario}`);

      await set(userRef, {
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
  }
}