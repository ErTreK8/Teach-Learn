import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BuscadorCursosComponent } from './buscador-cursos/buscador-cursos.component';
import { PerfilPropioComponent } from './perfil-propio/perfil-propio.component';
import { PaginaHomeComponent } from './pagina-home/pagina-home.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },  // Página principal
  { 
    path: '', 
    component: PaginaHomeComponent,  // Componente que contiene el Navbar
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'buscadorCursos', component: BuscadorCursosComponent } ,
      { path: 'perfilPropio', component: PerfilPropioComponent }, // Página de perfil propio
      { path: 'homeAlfred', component: HomeComponent }, // Página de perfil propio
      { path: 'chat', component: ChatComponent  } // Página de perfil propio
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
