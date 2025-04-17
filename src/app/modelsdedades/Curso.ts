export class Curso {
    idCurso!: string; // Asegúrate de que sea string
    nomCurso!: string;
    descripcion!: string;
  
    constructor(data?: Partial<Curso>) {
      Object.assign(this, data);
    }
  }