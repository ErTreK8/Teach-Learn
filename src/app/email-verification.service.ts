import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {
  constructor() {
    // Inicializa EmailJS con tu Public Key
    emailjs.init('Gpelb3Bh3DhgimX5T'); // Reemplaza con tu Public Key de EmailJS
  }

  sendEmailVerificationCode(email: string, verificationCode: string): Promise<void> {
    const templateParams = {
      to_email: email, // Correo del destinatario
      verification_code: verificationCode // Código de verificación
    };

    return emailjs.send('service_fd6brva', 'template_zsa5zdq', templateParams).then(
      () => {
        console.log('Correo enviado correctamente');
      },
      (error) => {
        console.error('Error al enviar el correo:', error);
        throw new Error('Error al enviar el correo');
      }
    );
  }
}