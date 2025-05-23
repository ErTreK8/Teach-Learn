import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Para navegar entre rutas
import { getDatabase, ref, get, push, set, remove } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { Curso } from '../modelsdedades/Curso';
import { Clase } from '../modelsdedades/Clase';


@Component({
  selector: 'app-buscador-cursos',
  templateUrl: './buscador-cursos.component.html',
  styleUrls: ['./buscador-cursos.component.css']
})
export class BuscadorCursosComponent implements OnInit {
  cursos: Curso[] = [];
  filteredCursos: Curso[] = [];
  errorMessage: string | null = null;
  searchTerm: string = '';
  showAddForm: boolean = false; // Controla si se muestra el formulario de añadir curso
  newCurso: { nomCurso: string; descripcion: string } = { nomCurso: '', descripcion: '' }; // Modelo para el nuevo curso

  constructor(private router: Router) {} // Inyectar Router para navegación

  ngOnInit(): void {
    this.cargarCursosDesdeFirebase();
  }

  async cargarCursosDesdeFirebase(): Promise<void> {
    try {
      if (!getApps().length) {
        initializeApp(environment.fireBaseConfig);
      }

      const db = getDatabase();
      const coursesRef = ref(db, 'Cursos');
      const snapshot = await get(coursesRef);

      if (!snapshot.exists()) {
        throw new Error('No hay cursos registrados en la base de datos.');
      }

      const coursesData = snapshot.val();
      const coursesArray: Curso[] = Object.keys(coursesData).map((key) => new Curso({ idCurso: key, ...coursesData[key] }));

      this.cursos = coursesArray;
      this.filteredCursos = coursesArray;
    } catch (error: any) {
      console.error('Error al cargar cursos:', error.message || error);
      this.errorMessage = error.message || 'Error al cargar cursos.';
    }
  }

  filterCourses(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredCursos = [...this.cursos];
    } else {
      this.filteredCursos = this.cursos.filter(
        (curso) =>
          curso.nomCurso?.toLowerCase().includes(term) ||
          curso.descripcion?.toLowerCase().includes(term)
      );
    }
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.filterCourses();
  }

  isAdministrator(): boolean {
    const esAdmin = localStorage.getItem('esAdmin');
    return esAdmin === 'true';
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm; // Alterna la visibilidad del formulario
  }

  async addCurso(): Promise<void> {
    if (!this.newCurso.nomCurso || !this.newCurso.descripcion) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const db = getDatabase();
      const coursesRef = ref(db, 'Cursos');

      // Generar una nueva clave para el curso
      const newCourseKey = push(coursesRef).key;

      if (!newCourseKey) {
        throw new Error('Error al generar la clave del curso.');
      }

      // Guardar el nuevo curso en Firebase
      await set(ref(db, `Cursos/${newCourseKey}`), {
        idCurso: newCourseKey,
        nomCurso: this.newCurso.nomCurso,
        descripcion: this.newCurso.descripcion
      });

      // Actualizar la lista local de cursos
      this.cursos.push(new Curso({ idCurso: newCourseKey, ...this.newCurso }));
      this.filteredCursos = [...this.cursos];

      // Limpiar el formulario
      this.newCurso = { nomCurso: '', descripcion: '' };
      this.showAddForm = false; // Ocultar el formulario después de añadir
    } catch (error: any) {
      console.error('Error al añadir el curso:', error.message || error);
      alert('Error al añadir el curso. Por favor, intenta de nuevo.');
    }
  }

  async eliminarCurso(idCurso: string): Promise<void> {
    if (!confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      return;
    }
  
    try {
      const db = getDatabase();
  
      // Paso 1: Obtener todas las clases asociadas al curso
      const clasesRef = ref(db, 'Classes');
      const clasesSnapshot = await get(clasesRef);
  
      if (clasesSnapshot.exists()) {
        const clasesData = clasesSnapshot.val();
        const clasesAsociadas = Object.values(clasesData).filter(
          (clase: any): clase is Clase => clase.idCurso === idCurso
        );
  
        // Paso 2: Filtrar las clases que no han comenzado
        const ahora = new Date().getTime(); // Tiempo actual en milisegundos
        const clasesNoComenzadas = clasesAsociadas.filter(
          (clase) => new Date(clase.dataInici).getTime() > ahora
        );
  
        // Paso 3: Eliminar las clases no comenzadas y sus relaciones
        for (const clase of clasesNoComenzadas) {
          const idClase = clase.idClass;
  
          // Eliminar la relación de usuarios inscritos en ClaseAlumno
          const claseAlumnoRef = ref(db, 'ClaseAlumno');
          const claseAlumnoSnapshot = await get(claseAlumnoRef);
  
          if (claseAlumnoSnapshot.exists()) {
            const claseAlumnoData = claseAlumnoSnapshot.val();
            for (const key in claseAlumnoData) {
              if (claseAlumnoData[key].idClase === idClase) {
                await remove(ref(db, `ClaseAlumno/${key}`));
              }
            }
          }
  
          // Eliminar la clase
          await remove(ref(db, `Classes/${idClase}`));
        }
      }
  
      // Paso 4: Eliminar el curso
      await remove(ref(db, `Cursos/${idCurso}`));
  
      // Actualizar la lista local de cursos
      this.cursos = this.cursos.filter((curso) => curso.idCurso !== idCurso);
      this.filteredCursos = this.filteredCursos.filter((curso) => curso.idCurso !== idCurso);
  
      alert('Curso eliminado correctamente.');
    } catch (error: any) {
      console.error('Error al eliminar el curso:', error.message || error);
      alert('Error al eliminar el curso. Por favor, intenta de nuevo.');
    }
  }

  // Método para navegar a la página de detalle del curso
  verDetalles(curso: Curso): void {
    this.router.navigate(['/curso', curso.idCurso]);
  }
}