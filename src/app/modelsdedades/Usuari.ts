export class Usuario {
  idUsr!: string;
  email!: string;
  password!: string; // Asegúrate de cifrar esto en producción
  esAdmin!: boolean;
  fotoPerfil!: string | null; // Foto de perfil (opcional, puede ser null)
  descripcion!: string | null; // Descripción (opcional)
  verified!: boolean;
  verificationCode!: string;
  nombre!: string | null; // Nuevo campo: Nombre
  apellido!: string | null; // Nuevo campo: Apellido
  teachCoins!: number; // Nuevo campo: TeachCoins


  constructor(data?: Partial<Usuario>) {
    Object.assign(this, data);
  }
}