import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BuscadorCursosComponent } from './buscador-cursos/buscador-cursos.component';
import { PerfilPropioComponent } from './perfil-propio/perfil-propio.component';


const routes: Routes = [
  { path: '', component: LoginComponent },  // Página principal
  { path: 'register', component: RegisterComponent },
  { path: 'buscadorCursos', component: BuscadorCursosComponent } ,
  { path: 'perfilPropio', component: PerfilPropioComponent } // Página de perfil propio

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
