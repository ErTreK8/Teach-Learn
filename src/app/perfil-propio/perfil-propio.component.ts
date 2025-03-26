import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-perfil-propio',
  templateUrl: './perfil-propio.component.html',
  styleUrls: ['./perfil-propio.component.css']
})
export class PerfilPropioComponent implements OnInit {
  @ViewChild('perfilSection') perfilSection!: ElementRef;
  @ViewChild('perfilModificableSection') perfilModificableSection!: ElementRef;
  @ViewChild('modificarBtn') modificarBtn!: ElementRef;
  @ViewChild('guardarBtn') guardarBtn!: ElementRef;
  @ViewChild('cancelarBtn') cancelarBtn!: ElementRef;

  ngOnInit() {
    // Estado inicial: mostrar perfil y ocultar la edición
    this.perfilSection.nativeElement.style.display = 'flex';
    this.perfilModificableSection.nativeElement.style.display = 'none';

    // Al hacer clic en "Modificar Pefil", se oculta la sección de perfil y se muestra la de modificación
    this.modificarBtn.nativeElement.addEventListener('click', () => {
      this.perfilSection.nativeElement.style.display = 'none';
      this.perfilModificableSection.nativeElement.style.display = 'flex';
    });

    // Al pulsar "Cancelar", se vuelve a la vista de perfil sin guardar cambios
    this.cancelarBtn.nativeElement.addEventListener('click', () => {
      this.perfilSection.nativeElement.style.display = 'flex';
      this.perfilModificableSection.nativeElement.style.display = 'none';
    });

    // Al pulsar "Guardar Pefil", se podrían guardar los cambios y luego volver a la vista de perfil
    this.guardarBtn.nativeElement.addEventListener('click', () => {
      // Aquí iría la lógica para guardar los cambios, por ejemplo mediante una petición AJAX.
      // Por ahora, simplemente volvemos a la vista de perfil.
      this.perfilSection.nativeElement.style.display = 'flex';
      this.perfilModificableSection.nativeElement.style.display = 'none';
    });
  }
}
