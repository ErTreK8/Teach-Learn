import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app'; // Para inicializar Firebase
import { environment } from '../../environments/environment'; // Configuración de Firebase
import { Clase } from '../modelsdedades/Clase'; // Modelo de Clase

@Component({
  selector: 'app-curso',
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent implements OnInit {
  cursoId: string | null = null; // ID del curso seleccionado
  curso: any = {}; // Detalles del curso
  clases: Clase[] = []; // Lista de clases asociadas al curso

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener el ID del curso de la URL
    this.route.params.subscribe(params => {
      this.cursoId = params['idCurso'];
      this.cargarCursoYClases();
    });
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
        this.clases = Object.keys(classesData)
          .map((key) => new Clase({ idClass: key, ...classesData[key] }))
          .filter((clase) => clase.idCurso === this.cursoId); // Filtrar por idCurso
      }
    } catch (error: any) {
      console.error('Error al cargar el curso y las clases:', error.message || error);
    }
  }
}