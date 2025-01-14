import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat'; 
import firebase from "@firebase/app-compat" // --- versió 8.16  

// hem afegit /compat/ en la versió 23-24
import 'firebase/compat/auth';

// hem afegit aquest import a la versió 23-24
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'; 
import { ServeiLogService } from './servei-log.service';
import { ServeiPerfilsService } from './servei-perfils.service';

@Injectable({
  providedIn: 'root'
})
export class ServeiAutenticarService {

  loginOK=false
  usuari: any

  email = ''
  psw = ''
  
  constructor(public auth: AngularFireAuth, private serveiLog: ServeiLogService, private serveiPerfil: ServeiPerfilsService  ) { }

  googleLogin() {
    signInWithPopup(getAuth(), new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        
        localStorage.setItem("email",this.email);
                // localStorage.setItem("uid",this.usuari.uid)

        // Si ens hem pogut
        // connectar podem obtenir les credencials que ens permetran accedir a l'API de Google
        var credencial = GoogleAuthProvider.credentialFromResult(result);
        this.serveiLog.sHaConnectat(this.usuari.email)
        console.log("credencial -->", credencial)



        // Si tenim les credencials en podem extreure un token
        var token = credencial?.accessToken;
        console.log("token-->", token)

        // si el login ha anat bé la variable usuari guardarà les dades
        this.usuari = result.user
        console.log('Usuari de Google: ', this.usuari);

        // si el login ha anat bé la variable email guardarà el compte de GMail
        this.email = this.usuari.email
        console.log('Email: ' + this.email + " - Nom: " + this.usuari.displayName)
        this.loginOK = true
      }).catch((error) => {
        console.log("--->", error.message)
        console.log('Error al fer el Google login');
        this.loginOK = false
      });
  }
  login() {
    // signInWithEmailAndPassword() és una Promise que permetrà utilitzar .then i .catch 
    this.auth.signInWithEmailAndPassword(this.email, this.psw)
    .then( user => {
      localStorage.setItem("email",this.email);
      // localStorage.setItem("uid",this.usuari.user.uid)
      // this.serveiLog.sHaConnectat(this.usuari.email)
      console.log('Usuari: ', user);
      this.usuari=user;
      this.usuari.email=this.email;
      this.psw='';
      this.loginOK= true;
    })
    .catch( error => {
      console.log("--->", error.message)
      console.log("Error al fer login amb l'email login");   
    })  
  }
  // logout 
  logout() {
    console.log('Hem tancat la sessió');
    localStorage.removeItem("email")
    this.auth.signOut();
	this.email=''
    this.psw=''
    this.usuari = null;
    this.loginOK = false
  }
  addPerfilGoogle()
{
const perfilUsuari = {
uid: this.usuari.uid,
email: this.email,
nom:this.usuari.displayName,
nomFitxerAvatar: '',
urlAvatar: '',
fitxer: new File([], '')
}
this.serveiPerfil.nouUsuari(perfilUsuari)
}

addPerfil()
{
const perfilUsuari = {
uid: this.usuari.user.uid,
email: this.usuari.email,
nom: '',
nomFitxerAvatar: '',
urlAvatar: '',
fitxer: new File([], '')
}
this.serveiPerfil.nouUsuari(perfilUsuari)
}

}
