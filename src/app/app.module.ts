import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { LoginComponent } from './login/login.component';

import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment.development';


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
   
  providers: [
    provideFirebaseApp(() => initializeApp({"projectId":"teachandlearn-1f6f3","appId":"1:1058607242332:web:09d39957302ebff9bbda99","storageBucket":"teachandlearn-1f6f3.firebasestorage.app","apiKey":"AIzaSyCttDM_9__ddvS7z8zf5y-D8awuaVrRQUo","authDomain":"teachandlearn-1f6f3.firebaseapp.com","messagingSenderId":"1058607242332","measurementId":"G-4PTJ1QDE17"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
