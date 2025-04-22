import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { PaginaHomeComponent } from './pagina-home/pagina-home.component';
import { BuscadorCursosComponent } from './buscador-cursos/buscador-cursos.component';
import { BusadorUsuarioComponent } from './busador-usuario/busador-usuario.component';
import { PerfilPropioComponent } from './perfil-propio/perfil-propio.component';
import { CrearClaseComponent } from './crear-clase/crear-clase.component';
import { ResenyaComponent } from './resenya/resenya.component';
import { CursoComponent } from './curso/curso.component';
import { ClaseComponent } from './clase/clase.component';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './auth-guard.service'; // Importa el guard

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Página de login
  { path: 'register', component: RegisterComponent }, // Página de registro
  { path: 'verify-email', component: VerifyEmailComponent }, // Verificación de correo

  // Rutas protegidas (requieren autenticación)
  {
    path: '',
    component: PaginaHomeComponent, // Componente que contiene el Navbar
    canActivate: [AuthGuard], // Protege estas rutas con el AuthGuard
    children: [
      { path: 'buscadorCursos', component: BuscadorCursosComponent },
      { path: 'resenya/:idClase', component: ResenyaComponent },
      { path: 'buscadorUsuarios', component: BusadorUsuarioComponent },
      { path: 'perfil/:idUsuario', component: PerfilPropioComponent },
      { path: 'home', component: HomeComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'curso/:idCurso', component: CursoComponent },
      { path: 'clase', component: ClaseComponent },
      { path: 'crearClase/:idCurso', component: CrearClaseComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' } // Redirige a /home por defecto
    ] 
  },

  // Redirigir la raíz ('/') al login si no está autenticado
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Si no hay ruta, redirige al login
  { path: '**', redirectTo: 'login' } // Maneja rutas desconocidas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}