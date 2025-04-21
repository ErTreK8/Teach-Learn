import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, ref, push, set, get } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-resenya',
  templateUrl: './resenya.component.html',
  styleUrls: ['./resenya.component.css']
})
export class ResenyaComponent implements OnInit {
  idClase: string | null = null; // ID de la clase
  nota: number = 0; // Nota de la reseña
  comentario: string = ''; // Comentario de la reseña
  userId: string | null = null; // ID del usuario

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.idClase = this.route.snapshot.paramMap.get('idClase'); // Obtener el ID de la clase desde la URL
    this.userId = localStorage.getItem('idUsr'); // Obtener el ID del usuario desde localStorage
  }

  async enviarResenya(): Promise<void> {
    try {
      if (!this.idClase || !this.userId) {
        throw new Error('ID de clase o usuario no encontrado.');
      }

      if (this.nota < 1 || this.nota > 10) {
        alert('La nota debe estar entre 1 y 10.');
        return;
      }

      if (!getApps().length) {
        initializeApp(environment.fireBaseConfig);
      }

      const db = getDatabase();

      // Guardar la reseña en Firebase
      const resenyaRef = ref(db, `Resenyas`);
      const nuevaResenyaKey = push(resenyaRef).key;

      if (!nuevaResenyaKey) {
        throw new Error('Error al generar la clave de la reseña.');
      }

      // Guardar la reseña en el nodo Resenyas
      await set(ref(db, `Resenyas/${nuevaResenyaKey}`), {
        Nota: this.nota,
        Resenya: this.comentario,
        idUsuario: this.userId // Añadimos el ID del usuario
      });

      // Asociar la reseña con la clase en ResenyasClase
      await set(ref(db, `ResenyasClase/${nuevaResenyaKey}`), {
        IdResenyaClase: nuevaResenyaKey,
        idClase: this.idClase,
        idResenya: nuevaResenyaKey,
        idUsuario: this.userId // Añadimos el ID del usuario aquí también
      });

      // Actualizar el estado de "acabada" en ClaseAlumno
      const claseAlumnoRef = ref(db, `ClaseAlumno`);
      const claseAlumnoSnapshot = await get(claseAlumnoRef);

      if (claseAlumnoSnapshot.exists()) {
        const clasesData: Record<string, any> = claseAlumnoSnapshot.val();
        const key = Object.keys(clasesData).find(
          (key) => clasesData[key].idClase === this.idClase && clasesData[key].idUsuario === this.userId
        );

        if (key) {
          // Actualizar el estado "acabada" a true
          await set(ref(db, `ClaseAlumno/${key}/acabada`), true);
        }
      }

      alert('Reseña enviada exitosamente.');
      this.router.navigate(['/home']); // Redirigir al home
    } catch (error: any) {
      console.error('Error al enviar la reseña:', error.message || error);
      alert('Error al enviar la reseña. Por favor, intenta de nuevo.');
    }
  }
}