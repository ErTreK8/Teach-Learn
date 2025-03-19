import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  newMessage: string = '';
  user: any;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      this.user = user;
    });

    // Obtener mensajes en tiempo real
    this.afs
      .collection('messages', ref => ref.orderBy('timestamp'))
      .valueChanges()
      .subscribe((messages: any[]) => {
        this.messages = messages;
      });
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const message = {
        sender: this.user?.email || 'Anónimo',
        text: this.newMessage,
        timestamp: new Date(),
      };

      // Guardar el mensaje en Firebase
      this.afs.collection('messages').add(message);

      this.newMessage = '';
    }
  }
}
