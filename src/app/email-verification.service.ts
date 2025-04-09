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
    console.log('Dirección del destinatario:', email);
    console.log('Código de verificación:', verificationCode);
  
    const templateParams = {
      to_email: email,
      verification_code: verificationCode
    };
  
    console.log('Parámetros de correo:', templateParams);
  
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