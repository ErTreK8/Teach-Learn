import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { entradaLog } from './modelsdedades/entradaLog';

@Injectable({
  providedIn: 'root'
})
export class ServeiLogService {
  bdLog = '/log/';

  constructor(private bd: AngularFireDatabase) { }
  // log de la connexió
  sHaConnectat(usr: any) {
    const dades: entradaLog= { op: 'login', usuari: usr}
    this.bd.object(this.bdLog+Date().toString()).update(dades) // update equival a
   // insert si no existeix l'element
    .then( d => { console.log("Dades inserides correctament al Log") })
    .catch( error => { console.log("Error accedint al Log") })
    }
}
    
