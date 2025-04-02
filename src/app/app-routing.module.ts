import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BuscadorCursosComponent } from './buscador-cursos/buscador-cursos.component';
import { PerfilPropioComponent } from './perfil-propio/perfil-propio.component';
import { BusadorUsuarioComponent } from './busador-usuario/busador-usuario.component';
import { CrearResenyaComponent } from './crear-resenya/crear-resenya.component';


const routes: Routes = [
  { path: '', component: LoginComponent },  // Página principal
  { path: 'register', component: RegisterComponent },
  { path: 'buscadorCursos', component: BuscadorCursosComponent } ,
  { path: 'perfilPropio', component: PerfilPropioComponent } ,// Página de perfil propio
  { path: 'buscadorUsuario', component: BusadorUsuarioComponent }, // Página de perfil propio
  { path: 'CrearRessenya', component: CrearResenyaComponent }, // Página de perfil propio



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
