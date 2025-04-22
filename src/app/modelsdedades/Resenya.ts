export class Resenya {
    idResenya!: string; // ID único de la reseña
    Resenya!: string; // Comentario de la reseña
    Nota!: number; // Calificación (por ejemplo, entre 1 y 10)
    idUsuario!: string; // ID del usuario que escribió la reseña
  
    constructor(data?: Partial<Resenya>) {
      Object.assign(this, data);
    }
  }