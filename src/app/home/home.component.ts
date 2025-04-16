import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    this.printLocalStorageData();
  }

  // Método para imprimir los datos del localStorage
  printLocalStorageData(): void {
    console.log('Datos del usuario en localStorage:');
    
    // Acceder a las claves específicas que guardaste
    const email = localStorage.getItem('email');
    const esAdmin = localStorage.getItem('esAdmin');
    const fotoPerfil = localStorage.getItem('fotoPerfil');
    const idUsr = localStorage.getItem('idUsr');
    const verified = localStorage.getItem('verified');

    // Imprimir los datos en la consola
    console.log(`Email: ${email}`);
    console.log(`Es Admin: ${esAdmin}`);
    console.log(`Foto Perfil: ${fotoPerfil}`);
    console.log(`ID Usuario: ${idUsr}`);
    console.log(`Verificado: ${verified}`);
  }
}