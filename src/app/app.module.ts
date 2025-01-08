import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
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
