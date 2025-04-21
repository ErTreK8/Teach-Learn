export class Resena {
    idResena!: string; // ID único de la reseña
    idUsuario!: string; // ID del usuario que escribió la reseña
    autorNombre!: string; // Nombre del autor de la reseña
    autorApellido!: string; // Apellido del autor de la reseña
    autorFoto!: string; // URL de la foto de perfil del autor
    comentario!: string; // Comentario o texto de la reseña
    nota!: number; // Nota o calificación (por ejemplo, entre 1 y 10)
    fechaCreacion!: Date; // Fecha en que se creó la reseña
  
    constructor(data?: Partial<Resena>) {
      Object.assign(this, data);
    }
  }