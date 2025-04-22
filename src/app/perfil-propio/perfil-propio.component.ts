import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getDatabase, ref, set, get } from 'firebase/database';
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
  fotoPerfil: string = '../../assets/account_circle.png';
  descripcion: string = '';
  resenas: any[] = [];
  modoEdicion: boolean = false;
  nuevaDescripcion: string = '';

  HayResenas: boolean = false;
  PerfilPropio: boolean = false;

  // Nota media de las reseñas
  notaMedia: number = 0;

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
        const userData = userSnap.val() as Usuario; // Usamos el modelo Usuario
        this.nombre = userData.nombre || 'Sin nombre';
        this.apellido = userData.apellido || 'Sin apellido';
        this.fotoPerfil = userData.fotoPerfil || '../../assets/account_circle.png';
        this.descripcion = userData.descripcion || 'Sin descripción.';
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
                : { nombre: 'Anónimo', apellido: '', fotoPerfil: '../../assets/account_circle.png' };

              // Obtener datos de la reseña
              const resenaSnap = await get(ref(db, `Resenyas/${idResenya}`));
              if (resenaSnap.exists()) {
                const resenaData = resenaSnap.val() as Resenya; // Usamos el modelo Resenya

                resenasCompletas.push({
                  autorNombre: `${autorData.nombre} ${autorData.apellido}`,
                  autorFoto: autorData.fotoPerfil || '../../assets/account_circle.png',
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

      // Guardar cambios en Firebase
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