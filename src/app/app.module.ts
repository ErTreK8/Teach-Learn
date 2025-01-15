import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule} from '@angular/fire/compat/auth';
import { environment} from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
 AppRoutingModule,
 AngularFireModule.initializeApp(environment.fireBaseConfig),
 AngularFireAuthModule,
AngularFireDatabaseModule,
 FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
