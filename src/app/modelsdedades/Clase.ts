export class Clase {
    idClass!: number;
    idCurso!: number;
    dataInici!: string;
    dataFi!: string;
    descripcio!: string;
    maxAlumnes!: number;
  
    constructor(data?: Partial<Clase>) {
      Object.assign(this, data);
    }
  }