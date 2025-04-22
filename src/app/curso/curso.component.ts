import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getDatabase, ref, get, set, push, remove } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app'; // Para inicializar Firebase
import { environment } from '../../environments/environment'; // Configuración de Firebase
import { Router } from '@angular/router';

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent implements OnInit {
  cursoId: string | null = null; // ID del curso seleccionado
  curso: any = {}; // Detalles del curso
  clases: any[] = []; // Lista de clases asociadas al curso
  userId: string | null = null; // ID del usuario actual

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Obtener el ID del curso de la URL
    this.route.params.subscribe(params => {
      this.cursoId = params['idCurso'];
      this.userId = localStorage.getItem('idUsr'); // Obtener el ID del usuario actual
      this.cargarCursoYClases();
    });
  }

  isModoProfesor(): boolean {
    const modoProfesor = localStorage.getItem('modoProfesor');
    return modoProfesor === 'true';
  }

  esCreador(clase: any): boolean {
    return clase.idProfesor === this.userId;
  }

  yaEstaApuntado(idClass: string): boolean {
    if (!this.clases || this.clases.length === 0) return false;
    const clase = this.clases.find(c => c.idClass === idClass);
    return clase?.alumnosUnidos.some((alumno: any) => alumno.idUsuario === this.userId);
  }

  async cargarCursoYClases(): Promise<void> {
    try {
      if (!getApps().length) {
        console.log('Inicializando Firebase...');
        initializeApp(environment.fireBaseConfig);
        console.log('Firebase inicializado correctamente.');
      }

      const db = getDatabase(); // Obtener la instancia de la base de datos

      // Obtener los detalles del curso
      const courseRef = ref(db, `Cursos/${this.cursoId}`);
      const courseSnapshot = await get(courseRef);

      if (courseSnapshot.exists()) {
        this.curso = courseSnapshot.val(); // Guardar los detalles del curso
      } else {
        throw new Error('El curso no existe en la base de datos.');
      }

      // Obtener las clases asociadas al curso
      const classesRef = ref(db, `Classes`);
      const classesSnapshot = await get(classesRef);

      if (classesSnapshot.exists()) {
        const classesData = classesSnapshot.val();
        const clasesRaw = Object.keys(classesData)
          .map((key) => ({ idClass: key, ...classesData[key] }))
          .filter((clase) => clase.idCurso === this.cursoId); // Filtrar por idCurso

        // Cargar los datos del profesor y alumnos para cada clase
        const clasesConDatos = await Promise.all(
          clasesRaw.map(async (clase) => {
            const profesor = await this.obtenerDatosProfesor(clase.idProfesor);
            const alumnosUnidos = await this.obtenerAlumnosUnidos(clase.idClass);
            return {
              ...clase,
              nombreProfesor: profesor?.nombre || 'Profesor Desconocido',
              apellidoProfesor: profesor?.apellido || 'Profesor Desconocido',
              fotoPerfilProfesor: profesor?.fotoPerfil || '../../assets/account_circle.png',
              alumnosUnidos: alumnosUnidos
            };
          })
        );

        // Filtrar las clases cuya fecha de inicio sea anterior o igual a la fecha actual
        const fechaActual = new Date();
        this.clases = clasesConDatos.filter((clase) => {
          const fechaInicio = new Date(clase.dataInici);
          return fechaInicio >= fechaActual; // Solo mostrar clases que ya han comenzado
        });
      }
    } catch (error: any) {
      console.error('Error al cargar el curso y las clases:', error.message || error);
    }
  }

  async obtenerDatosProfesor(idProfesor: string): Promise<any> {
    try {
      const db = getDatabase();
      const userRef = ref(db, `Usuario/${idProfesor}`);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        return userSnapshot.val();
      } else {
        return null;
      }
    } catch (error: any) {
      console.error('Error al obtener los datos del profesor:', error.message || error);
      return null;
    }
  }

  async obtenerAlumnosUnidos(idClass: string): Promise<any[]> {
    try {
      const db = getDatabase();
      const alumnosRef = ref(db, `ClaseAlumno`);
      const alumnosSnapshot = await get(alumnosRef);

      if (alumnosSnapshot.exists()) {
        const alumnosData = alumnosSnapshot.val();
        const alumnosFiltrados = Object.values(alumnosData).filter(
          (alumno: any) => alumno.idClase === idClass && !alumno.acabada
        );

        // Obtener los datos de cada alumno
        const alumnosConDatos = await Promise.all(
          alumnosFiltrados.map(async (alumno: any) => {
            const datosAlumno = await this.obtenerDatosProfesor(alumno.idUsuario);
            return {
              idUsuario: alumno.idUsuario,
              nombre: datosAlumno?.nombre || 'Alumno Desconocido',
              apellido: datosAlumno?.apellido || '',
              fotoPerfil: datosAlumno?.fotoPerfil || '../../assets/account_circle.png'
            };
          })
        );

        return alumnosConDatos;
      } else {
        return [];
      }
    } catch (error: any) {
      console.error('Error al obtener los alumnos unidos:', error.message || error);
      return [];
    }
  }

  irACrearClase(): void {
    this.router.navigate(['/crearClase', this.cursoId]);
  }

  async unirseAClase(idClass: string): Promise<void> {
    try {
      const db = getDatabase();
      const alumnosRef = ref(db, `ClaseAlumno`);

      // Verificar si el usuario ya está apuntado a más de 3 clases pendientes
      const alumnosSnapshot = await get(alumnosRef);
      if (alumnosSnapshot.exists()) {
        const alumnosData = alumnosSnapshot.val();
        const clasesPendientes = Object.values(alumnosData).filter(
          (alumno: any) => alumno.idUsuario === this.userId && alumno.acabada === false
        );

        if (clasesPendientes.length >= 3) {
          alert('Ya has alcanzado el límite máximo de 3 clases pendientes.');
          return;
        }
      }

      // Guardar al alumno en la clase
      const nuevoAlumno = {
        idClase: idClass,
        idUsuario: this.userId,
        acabada: false
      };

      const nuevoAlumnoKey = push(alumnosRef).key;

      if (!nuevoAlumnoKey) {
        throw new Error('Error al generar la clave del alumno.');
      }

      await set(ref(db, `ClaseAlumno/${nuevoAlumnoKey}`), nuevoAlumno);

      alert('Te has unido a la clase exitosamente.');
      this.cargarCursoYClases(); // Recargar las clases
    } catch (error: any) {
      console.error('Error al unirse a la clase:', error.message || error);
      alert('Error al unirse a la clase. Por favor, intenta de nuevo.');
    }
  }

  async salirDeClase(idClass: string): Promise<void> {
    try {
      const db = getDatabase();
      const alumnosRef = ref(db, `ClaseAlumno`);
      const alumnosSnapshot = await get(alumnosRef);

      if (alumnosSnapshot.exists()) {
        const alumnosData = alumnosSnapshot.val();
        Object.keys(alumnosData).forEach(async (key) => {
          const alumno = alumnosData[key];
          if (alumno.idClase === idClass && alumno.idUsuario === this.userId) {
            await remove(ref(db, `ClaseAlumno/${key}`));
          }
        });
      }

      alert('Has salido de la clase exitosamente.');
      this.cargarCursoYClases(); // Recargar las clases
    } catch (error: any) {
      console.error('Error al salir de la clase:', error.message || error);
      alert('Error al salir de la clase. Por favor, intenta de nuevo.');
    }
  }

  async eliminarClase(idClass: string): Promise<void> {
    try {
      const db = getDatabase();

      // Marcar como acabada a todos los alumnos apuntados a esta clase
      const alumnosRef = ref(db, `ClaseAlumno`);
      const alumnosSnapshot = await get(alumnosRef);

      if (alumnosSnapshot.exists()) {
        const alumnosData = alumnosSnapshot.val();
        Object.keys(alumnosData).forEach(async (key) => {
          const alumno = alumnosData[key];
          if (alumno.idClase === idClass) {
            await set(ref(db, `ClaseAlumno/${key}/acabada`), true);
          }
        });
      }

      // Eliminar la clase
      const claseRef = ref(db, `Classes/${idClass}`);
      await remove(claseRef);

      alert('Clase eliminada exitosamente.');
      this.cargarCursoYClases(); // Recargar las clases
    } catch (error: any) {
      console.error('Error al eliminar la clase:', error.message || error);
      alert('Error al eliminar la clase. Por favor, intenta de nuevo.');
    }
  }
}