import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BuscadorCursosComponent } from './buscador-cursos/buscador-cursos.component';
import { PerfilPropioComponent } from './perfil-propio/perfil-propio.component';
import { PaginaHomeComponent } from './pagina-home/pagina-home.component';
import { BusadorUsuarioComponent } from './busador-usuario/busador-usuario.component';
import { ChatComponent } from './chat/chat.component';
import { CrearResenyaComponent } from './crear-resenya/crear-resenya.component';
import { ModificarPerfilComponent } from './modificar-perfil/modificar-perfil.component';
import { PaginaChatsComponent } from './pagina-chats/pagina-chats.component';
import { PerfilAjenoComponent } from './perfil-ajeno/perfil-ajeno.component';
import { ClaseComponent } from './clase/clase.component';
import { CursoComponent } from './curso/curso.component';

const routes: Routes = [
  { path: '', component: LoginComponent },  // Página principal
  { path: 'register', component: RegisterComponent },
  { path: 'buscadorCursos', component: BuscadorCursosComponent } ,
  { path: 'perfilPropio', component: PerfilPropioComponent }, // Página de perfil propio
  { path: 'home', component: PaginaHomeComponent }, // Página de perfil propio
  { path: 'clase', component: ClaseComponent }, // Página de perfil propio
  { path: 'buscadorUsuarios', component: BusadorUsuarioComponent }, // Página de perfil propio
  { path: 'chat', component: ChatComponent }, // Página de perfil propio
  { path: 'crearResenya', component: CrearResenyaComponent }, // Página de perfil propio
  { path: 'curso', component: CursoComponent }, // Página de perfil propio
  { path: 'paginaUsuarioChats', component: PaginaChatsComponent }, // Página de perfil propio
  { path: 'perfilAjeno', component: PerfilAjenoComponent } // Página de perfil propio

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
