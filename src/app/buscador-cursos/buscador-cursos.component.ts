import { Component } from '@angular/core';

@Component({
  selector: 'app-buscador-cursos',
  templateUrl: './buscador-cursos.component.html',
  styleUrls: ['./buscador-cursos.component.css'],
})
export class BuscadorCursosComponent {
  selectedDate: Date = new Date(); // Fecha seleccionada

  onDateChange(newDate: Date): void {
    console.log('Fecha seleccionada:', newDate);
    this.selectedDate = newDate;
  }
}