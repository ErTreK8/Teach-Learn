export class Clase {
    idClass!: string;
    idCurso!: string;
    dataInici!: string;
    dataFi!: string;
    descripcio!: string;
    maxAlumnes!: number;
  
    constructor(data?: Partial<Clase>) {
      Object.assign(this, data);
    }
  }