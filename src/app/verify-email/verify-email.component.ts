import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getDatabase, ref, get, set } from 'firebase/database'; // Importa 'set'
import { Router } from '@angular/router'; // Importa el Router


@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  userId: string | null = null;
  verificationCode: string = '';
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    console.log('ID del usuario:', this.userId);
  }

  verifyCode(): void {
    if (!this.userId || !this.verificationCode) {
      this.errorMessage = 'Faltan datos para verificar el correo.';
      console.error('Error: Faltan datos para verificar el correo.');
      return; // Retorna aquí para evitar continuar si faltan datos
    }
  
    const db = getDatabase();
    const userRef = ref(db, `Usuario/${this.userId}`);
  
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          if (userData.verificationCode === this.verificationCode) {
            alert('Correo verificado correctamente.');
            // Actualiza el estado del usuario en la base de datos
            return set(userRef, { ...userData, verified: true }); // Devuelve la promesa de 'set'
            this.router.navigate(['/login']);

          } else {
            this.errorMessage = 'Código de verificación incorrecto.';
            console.error('Error: Código de verificación incorrecto.');
            throw new Error('Código de verificación incorrecto.'); // Lanza un error para capturarlo en el catch
          }
        } else {
          this.errorMessage = 'Usuario no encontrado.';
          console.error('Error: Usuario no encontrado.');
          throw new Error('Usuario no encontrado.'); // Lanza un error para capturarlo en el catch
        }
      })
      .catch((error) => {
        console.error('Error al verificar el correo:', error);
        this.errorMessage = 'Error al verificar el correo.';
      });
  }
}