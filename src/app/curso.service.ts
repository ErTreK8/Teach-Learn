// src/app/curso.service.ts
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database'; // Para acceder a la base de datos de Firebase
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  // Inyectamos AngularFireDatabase para interactuar con Firebase
  constructor(private db: AngularFireDatabase) { }

  // Método para obtener todos los cursos desde Firebase
  getCursos(): Observable<any[]> {
    return this.db.list('Cursos').valueChanges();  // Devuelve una lista de cursos
  }
}
