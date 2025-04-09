import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BuscadorCursosComponent } from './buscador-cursos/buscador-cursos.component';
import { PerfilPropioComponent } from './perfil-propio/perfil-propio.component';
import { PaginaHomeComponent } from './pagina-home/pagina-home.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component'; // Importa el componente


const routes: Routes = [
  { path: 'login', component: LoginComponent },  // Página principal
  { path: 'register', component: RegisterComponent },

  { 
    path: '', 
    component: PaginaHomeComponent,  // Componente que contiene el Navbar
    children: [
      { path: 'buscadorCursos', component: BuscadorCursosComponent } ,
      { path: 'perfilPropio', component: PerfilPropioComponent }, 
      { path: 'home', component: HomeComponent }, 
      { path: 'chat', component: ChatComponent  }, 
      { path: 'verify-email', component: VerifyEmailComponent },
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
