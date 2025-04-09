// src/app/buscador-cursos/buscador-cursos.component.ts
import { Component, OnInit } from '@angular/core';
import { CursoService } from '../curso.service'; // Importa el servicio CursoService

@Component({
  selector: 'app-buscador-cursos',
  templateUrl: './buscador-cursos.component.html',
  styleUrls: ['./buscador-cursos.component.css']
})
export class BuscadorCursosComponent implements OnInit {
  cursos: any[] = [];  // Aquí guardamos los cursos que obtenemos de Firebase

  constructor(private cursoService: CursoService) { }

  ngOnInit(): void {
    // Llamamos al método getCursos del servicio
    this.cursoService.getCursos().subscribe(data => {
      this.cursos = data;  // Asignamos los cursos al array
    });
  }
}
