export class Usuario {
    idUsr!: string;
    email!: string;
    nomUsr!: string;
    password!: string; // Asegúrate de cifrar esto en producción
    esAdmin!: boolean;
    fotoPerfil!: string;
    descripcion!: string;
    verified!: boolean;
    verificationCode!: string;
  
    constructor(data?: Partial<Usuario>) {
      Object.assign(this, data);
    }
  }