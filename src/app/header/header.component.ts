import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {

  // Acceso a elementos del DOM mediante ViewChild y template references
  @ViewChild('myLinks') myLinks!: ElementRef;
  @ViewChild('hambuergerDisplay') hambuergerDisplay!: ElementRef;
  @ViewChild('modo') modoTexto!: ElementRef;
  @ViewChild('barra') barra!: ElementRef;
  @ViewChild('nav') nav!: ElementRef;
  @ViewChild('logo') logo!: ElementRef;
  @ViewChild('FotoUser') FotoUser!: ElementRef;
  @ViewChild('check') check!: ElementRef; // Referencia al checkbox

  constructor(private router: Router) {} // Inyecta el Router
  idUsuario: string | null = null;

  ngOnInit(): void {
    this.idUsuario = localStorage.getItem('idUsr'); // o de un servicio
  }
  ngAfterViewInit() {
    // Leer el estado del modo desde localStorage al cargar el componente
    const modoProfesor = localStorage.getItem('modoProfesor');
    const isProfesor = modoProfesor === 'true';

    // Actualizar la interfaz gráfica y el estado del checkbox
    this.updateModeUI(isProfesor);
    if (this.check) {
      this.check.nativeElement.checked = isProfesor; // Sincronizar el checkbox
    }
  }

  // Función para alternar el menú
  hamburgesa() {
    const myLinksEl = this.myLinks.nativeElement;
    const hambuergerDisplayEl = this.hambuergerDisplay.nativeElement;

    if (myLinksEl.style.display === "flex") {
      myLinksEl.style.display = "none";
    } else {
      myLinksEl.style.display = "flex";
    }

    if (myLinksEl.style.display === "flex") {
      hambuergerDisplayEl.textContent = "▲";
    } else {
      hambuergerDisplayEl.textContent = "▼";
    }
  }

  // Función para cambiar el modo (Alumno/Profesor)
  toggleMode(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    localStorage.setItem('modoProfesor', checked.toString()); // Guardar el estado en localStorage
    this.updateModeUI(checked); // Actualizar la UI según el modo
  }

  // Función para actualizar la interfaz gráfica según el modo
  private updateModeUI(isProfesor: boolean): void {
    const modoTextoEl = this.modoTexto.nativeElement;

    if (isProfesor) {
      modoTextoEl.textContent = "MODO PROFESOR";
      this.barra.nativeElement.style.backgroundColor = "#5A597A";
      this.hambuergerDisplay.nativeElement.style.color = "#5A597A";
      this.nav.nativeElement.style.backgroundColor = "#5A597A";
      modoTextoEl.style.color = "#5A597A";
      this.logo.nativeElement.src = "./assets/logoprofe.png";
      this.FotoUser.nativeElement.src = "./assets/account_profe.png";
    } else {
      modoTextoEl.textContent = "MODO ALUMNO";
      this.barra.nativeElement.style.backgroundColor = "#518094";
      modoTextoEl.style.color = "#518094";
      this.nav.nativeElement.style.backgroundColor = "#518094";
      this.hambuergerDisplay.nativeElement.style.color = "#518094";
      this.logo.nativeElement.src = "./assets/logoMini.png";
      this.FotoUser.nativeElement.src = "./assets/account_circle.png";
    }
  }

  // Función para cerrar sesión
  logout(): void {
    localStorage.clear(); // Elimina todos los datos del localStorage
    this.router.navigate(['/login']); // Redirige al usuario al login
  }
}