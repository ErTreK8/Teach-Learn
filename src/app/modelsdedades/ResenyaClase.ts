export class ResenyaClase {
    idResenyaClase!: string; // ID único de la reseña de clase
    idClase!: string; // ID de la clase asociada
    idResenya!: string; // ID de la reseña en la tabla `Resenyas`
    idUsuario!: string; // ID del usuario que escribió la reseña
    idProfesor!: string; // ID del profesor al que pertenece la clase
  
    constructor(data?: Partial<ResenyaClase>) {
      Object.assign(this, data);
    }
  }