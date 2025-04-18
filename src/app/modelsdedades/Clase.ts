export class Clase {
    idClass!: string;
    idCurso!: string;
    idProfesor!: string;
    dataInici!: string;
    dataFi!: string;
    titulo!: string;
    descripcio!: string;
    maxAlumnes!: number;

    constructor(data?: Partial<Clase>) {
      Object.assign(this, data);
    }
  }