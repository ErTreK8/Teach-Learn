import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Perfil } from '../assets/modelsdedades/perfil';
import { firstValueFrom } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServeiPerfilsService {

  bdPerfils = '/perfils/'

  constructor(private bd: AngularFireDatabase, private magatzem: AngularFireStorage) { }

  nouUsuari(perfilUsuari: Perfil) {
    // comprovem que no existeixi ja un perfil per a aquest usuari
    firstValueFrom(this.bd.object(this.bdPerfils + perfilUsuari.uid).valueChanges())
      .then((dades) => {
        localStorage.setItem("uid", perfilUsuari.uid)

        // Si l’usuari no existeix el donem d’alta i guardem l’uid al localStorage
        if (dades == null) {
          this.bd.object(this.bdPerfils + perfilUsuari.uid).update(perfilUsuari)    
            .then(() => { 
                console.log("Perfil inserit correctament")                
            })
            .catch((error) => {console.error("Error accedint als Perfils", error) });
          }
        })
  }

  getPerfil() {
    const uid =localStorage.getItem('uid')
    return this.bd.object(this.bdPerfils + uid).valueChanges();
  }

  pushPerfil(p: Perfil): Observable<number | undefined> {
    const rutaFitxer = this.bdPerfils+p.fitxer.name;
    const refMagatzem = this.magatzem.ref(rutaFitxer);
    const pujarFitxer = this.magatzem.upload(rutaFitxer, p.fitxer);

    pujarFitxer
      .snapshotChanges()
      .pipe(
        finalize(() => {
          refMagatzem.getDownloadURL().subscribe((url) => {
            // getDownloadURL() ens donarà la URL una vegada s'ha pujat el fitxer a l'Storage
            // ho fem per a guardar-lo en la base de dades en el camp url
            p.uid = localStorage.getItem('uid')!; // obtenim l'uid que hem guardat al localStorage al fer login - el signe ! és per a evitar l'error de que el valor pot ser null o undefined
            p.urlAvatar = url;
            p.nomFitxerAvatar = p.fitxer.name;
            this.bd
              .object(this.bdPerfils + localStorage.getItem('uid'))
              .update(p)
              .then((d) => {
                console.log('Dades inserides correctament');
              })
              .catch((error) => {
                console.log('Error accedint als Avatars');
              });
          });
        })
      )
      .subscribe();
    return pujarFitxer.percentageChanges();
  }
  
  // treiem l'avatar de la base de dades i el fitxer de l'Storage (magatzem)
  eliminarFitxer(p: Perfil, fitxerVell: string): void {
    const uid = p.uid
  
    this.eliminarFitxerDelMagatzem(fitxerVell);
    this.eliminarAvatarBaseDades(uid)
      .then(() => { })
      .catch(error => console.log(error));
  }
  
  // treiem l'avatar de la base de dades
  private eliminarAvatarBaseDades(id: string): Promise<void> {
    return this.bd.list(this.bdPerfils).remove(id);
  }
  
  // treiem el fitxer de l'Storage (magatzem)
  private eliminarFitxerDelMagatzem(nomFitxer: string): void {
    const refMagatzem = this.magatzem.ref(this.bdPerfils);
 
    refMagatzem.child('/'+nomFitxer).delete();
 } 

}

