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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PaginaHomeComponent,
    RegisterComponent,
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
    HomeComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}