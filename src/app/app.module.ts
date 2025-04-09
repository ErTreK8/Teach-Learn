import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { PaginaHomeComponent } from './pagina-home/pagina-home.component';
import { RegisterComponent } from './register/register.component';
import { BuscadorCursosComponent } from './buscador-cursos/buscador-cursos.component';
import { CursoComponent } from './curso/curso.component';
import { ClaseComponent } from './clase/clase.component';
import { PerfilPropioComponent } from './perfil-propio/perfil-propio.component';
import { PerfilAjenoComponent } from './perfil-ajeno/perfil-ajeno.component';
import { ModificarPerfilComponent } from './modificar-perfil/modificar-perfil.component';
import { BusadorUsuarioComponent } from './busador-usuario/busador-usuario.component';
import { CrearResenyaComponent } from './crear-resenya/crear-resenya.component';
import { PaginaChatsComponent } from './pagina-chats/pagina-chats.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PaginaHomeComponent,
    RegisterComponent,
    VerifyEmailComponent,
    BuscadorCursosComponent,
    CursoComponent,
    ClaseComponent,
    PerfilPropioComponent,
    PerfilAjenoComponent,
    ModificarPerfilComponent,
    BusadorUsuarioComponent,
    CrearResenyaComponent,
    PaginaChatsComponent,
    CalendarComponent,
    ChatComponent,
    HeaderComponent,
    HomeComponent,
    VerifyEmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.fireBaseConfig), // Inicializa Firebase aquí
    AngularFireAuthModule, // Autenticación de Firebase
    AngularFireDatabaseModule, // Base de datos de Firebase
    FormsModule, // Formularios tradicionales (ngModel)
    ReactiveFormsModule // Formularios reactivos
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({"projectId":"teachandlearn-231cd","appId":"1:1047176758748:web:8ae9b7357b43aab7f03b19","databaseURL":"https://teachandlearn-231cd-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"teachandlearn-231cd.firebasestorage.app","apiKey":"AIzaSyDj390FlRB-cr4KAW0IR3UDl1Jp_RtMUsY","authDomain":"teachandlearn-231cd.firebaseapp.com","messagingSenderId":"1047176758748","measurementId":"G-WVCKJFP0PE"})),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    console.log('AppModule inicializado');
  }
}