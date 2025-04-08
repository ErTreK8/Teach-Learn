// src/app/services/email-verification.service.ts
export function sendEmailVerificationCode(email: string, verificationCode: string): Promise<void> {
  // Simulación del envío de correo electrónico
  return new Promise((resolve, reject) => {
    console.log(`Enviando código de verificación al correo: ${email}`);
    console.log(`Código de verificación: ${verificationCode}`);

    // Simula éxito después de 1 segundo
    setTimeout(() => {
      resolve();
    }, 1000);

    // Si deseas simular un error, usa:
    // reject(new Error('Error al enviar el correo'));
  });
}