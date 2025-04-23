import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getDatabase, ref, push, set, get } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { Clase } from '../modelsdedades/Clase';

@Component({
  selector: 'app-crear-clase',
  templateUrl: './crear-clase.component.html',
  styleUrls: ['./crear-clase.component.css']
})
export class CrearClaseComponent {
  nuevaClase: any = {
    titulo: '',
    descripcio: '',
    fechaInicio: '', // Fecha de inicio sin hora
    horaInicio: '',  // Hora de inicio
    fechaFin: '',     // Fecha de fin sin hora
    horaFin: '',      // Hora de fin
    maxAlumnes: null
  };
  cursoId: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtener el ID del curso de la URL
    this.route.params.subscribe(params => {
      this.cursoId = params['idCurso'];
    });
  }

  async crearClase(): Promise<void> {
    try {
      // Combinar fecha y hora
      const dataInici = `${this.nuevaClase.fechaInicio}T${this.nuevaClase.horaInicio}`;
      const dataFi = `${this.nuevaClase.fechaFin}T${this.nuevaClase.horaFin}`;
  
      // Validaciones previas
      if (!this.validarCampos(dataInici, dataFi)) {
        return;
      }
  
      // Verificar que el usuario no tenga más de 3 clases activas
      const userId = localStorage.getItem('idUsr');
      if (!userId) {
        alert('No se ha encontrado el ID del usuario.');
        return;
      }
  
      const db = getDatabase();
      const classesRef = ref(db, 'Classes');
      const classesSnapshot = await get(classesRef);
  
      if (classesSnapshot.exists()) {
        const classesData = classesSnapshot.val();
        const clasesUsuario = Object.values(classesData).filter(
          (clase: any) => clase.idProfesor === userId
        );
  
        // Filtrar solo las clases cuya fecha de inicio sea mayor o igual a la fecha y hora actual
        const fechaActual = new Date();
        const clasesActivas = clasesUsuario.filter((clase: any) => {
          const fechaInicioClase = new Date(clase.dataInici);
          return fechaInicioClase >= fechaActual;
        });
  
        if (clasesActivas.length >= 3) {
          alert('Has alcanzado el límite máximo de 3 clases activas por usuario.');
          return;
        }
      }
  
      // Generar una nueva clave para la clase y guardarla en Firebase
      const newClassKey = push(classesRef).key;
  
      if (!newClassKey) {
        throw new Error('Error al generar la clave de la clase.');
      }
  
      await set(ref(db, `Classes/${newClassKey}`), {
        idClass: newClassKey,
        idCurso: this.cursoId,
        idProfesor: userId,
        dataInici: dataInici,
        dataFi: dataFi,
        titulo: this.nuevaClase.titulo,
        descripcio: this.nuevaClase.descripcio,
        maxAlumnes: this.nuevaClase.maxAlumnes
      });
  
      alert('Clase creada exitosamente.');
      this.router.navigate(['/curso', this.cursoId]); // Redirigir al detalle del curso
    } catch (error: any) {
      console.error('Error al crear la clase:', error.message || error);
      alert('Error al crear la clase. Por favor, intenta de nuevo.');
    }
  }

  cancelar(): void {
    this.router.navigate(['/curso', this.cursoId]); // Redirigir al detalle del curso
  }

  validarCampos(dataInici: string, dataFi: string): boolean {
    // Validar que el título no esté vacío
    if (!this.nuevaClase.titulo.trim()) {
      alert('El título de la clase no puede estar vacío.');
      return false;
    }

    // Validar que el máximo de alumnos sea mayor que 0
    if (this.nuevaClase.maxAlumnes <= 0) {
      alert('El número máximo de alumnos debe ser mayor que 0.');
      return false;
    }

    // Validar que la fecha de inicio sea menor que la fecha de fin
    const fechaInicio = new Date(dataInici);
    const fechaFin = new Date(dataFi);

    if (fechaInicio >= fechaFin) {
      alert('La fecha de inicio debe ser anterior a la fecha de fin.');
      return false;
    }

    // Validar que las fechas incluyan horas
    if (!this.nuevaClase.horaInicio || !this.nuevaClase.horaFin) {
      alert('Debes seleccionar tanto la fecha como la hora para el inicio y el fin.');
      return false;
    }

    return true;
  }
}