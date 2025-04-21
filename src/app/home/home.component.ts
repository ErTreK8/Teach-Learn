import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.printLocalStorageData();
    const idUsr = localStorage.getItem('idUsr');
    if (idUsr) {
      this.comprobarClases(idUsr);
    }
  }

  printLocalStorageData(): void {
    console.log('Datos del usuario en localStorage:');
    const email = localStorage.getItem('email');
    const esAdmin = localStorage.getItem('esAdmin');
    const fotoPerfil = localStorage.getItem('fotoPerfil');
    const idUsr = localStorage.getItem('idUsr');
    const verified = localStorage.getItem('verified');
    console.log(`Email: ${email}`);
    console.log(`Es Admin: ${esAdmin}`);
    console.log(`Foto Perfil: ${fotoPerfil}`);
    console.log(`ID Usuario: ${idUsr}`);
    console.log(`Verificado: ${verified}`);
  }

  async comprobarClases(userId: string): Promise<void> {
    try {
      if (!getApps().length) {
        initializeApp(environment.fireBaseConfig);
      }
      const db = getDatabase();

      // Obtener las clases del alumno
      const claseAlumnoRef = ref(db, `ClaseAlumno`);
      const claseAlumnoSnapshot = await get(claseAlumnoRef);

      if (claseAlumnoSnapshot.exists()) {
        const clasesData: Record<string, any> = claseAlumnoSnapshot.val();
        const clasesUsuario = Object.values(clasesData).filter(
          (clase: any) => clase.idUsuario === userId && !clase.acabada
        );

        if (clasesUsuario.length > 0) {
          const fechaActual = new Date();
          for (const clase of clasesUsuario) {
            const claseRef = ref(db, `Classes/${clase.idClase}`);
            const claseSnapshot = await get(claseRef);

            if (claseSnapshot.exists()) {
              const datosClase = claseSnapshot.val();
              const fechaFin = new Date(datosClase.dataFi);

              if (fechaActual > fechaFin) {
                this.router.navigate(['/resenya', clase.idClase]);
                return;
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error al comprobar las clases:', error.message || error);
    }
  }
}