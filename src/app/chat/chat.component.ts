import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getDatabase, ref, set, get, push, onValue } from 'firebase/database';
import { initializeApp, getApps } from 'firebase/app';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  idUsuario: string | null = localStorage.getItem('idUsr'); // ID del usuario logueado
  contactos: any[] = []; // Lista de últimos contactos
  mensajes: any[] = []; // Mensajes del chat seleccionado
  nuevoMensaje: string = ''; // Nuevo mensaje a enviar
  contactoSeleccionado: any = null; // Contacto seleccionado para chatear

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.cargarContactosDesdeMensajes();

    // Leer el ID del contacto desde los parámetros de consulta
    this.route.queryParams.subscribe((params) => {
      const idContacto = params['idContacto'];
      if (idContacto) {
        this.seleccionarContactoPorId(idContacto);
      }
    });

    this.escucharNuevosMensajes();
  }

  async cargarContactosDesdeMensajes(): Promise<void> {
    try {
      if (!getApps().length) initializeApp(environment.fireBaseConfig);
      const db = getDatabase();

      // Cargar mensajes del chat
      const chatsRef = ref(db, `Chats`);
      const chatsSnap = await get(chatsRef);

      if (chatsSnap.exists()) {
        const chatsData = chatsSnap.val();
        const contactosUnicos: any[] = [];

        Object.values(chatsData).forEach((mensaje: any) => {
          if (mensaje.idRecibe === this.idUsuario || mensaje.idEnvia === this.idUsuario) {
            const idContacto = mensaje.idRecibe === this.idUsuario ? mensaje.idEnvia : mensaje.idRecibe;

            // Verificar si el contacto ya está en la lista
            const contactoExistente = contactosUnicos.find((contacto) => contacto.id === idContacto);
            if (!contactoExistente) {
              // Agregar el nuevo contacto a la lista temporal
              contactosUnicos.push({
                id: idContacto,
                ultimoMensaje: mensaje.Mensaje,
                fechaUltimoMensaje: mensaje.fecha
              });
            } else {
              // Si el contacto ya existe, actualizar su último mensaje
              contactoExistente.ultimoMensaje = mensaje.Mensaje;
              contactoExistente.fechaUltimoMensaje = mensaje.fecha;
            }
          }
        });

        // Cargar datos adicionales de los usuarios (nombre y foto)
        for (const contacto of contactosUnicos) {
          const contactoRef = ref(db, `Usuario/${contacto.id}`);
          const contactoSnap = await get(contactoRef);

          if (contactoSnap.exists()) {
            const contactoData = contactoSnap.val();
            contacto.nombre = contactoData.nombre || 'Sin nombre';
            contacto.fotoPerfil = contactoData.fotoPerfil || '../../assets/account_circle.png';
          }
        }

        // Asignar la lista de contactos única
        this.contactos = contactosUnicos;
      }
    } catch (error: any) {
      console.error('Error al cargar contactos desde mensajes:', error.message);
    }
  }

  async seleccionarContacto(contacto: any): Promise<void> {
    this.contactoSeleccionado = contacto;
    await this.cargarMensajes(contacto.id);
  }

  async seleccionarContactoPorId(idContacto: string): Promise<void> {
    try {
      const db = getDatabase();

      // Buscar datos del contacto
      const contactoRef = ref(db, `Usuario/${idContacto}`);
      const contactoSnap = await get(contactoRef);

      if (contactoSnap.exists()) {
        const contactoData = contactoSnap.val();
        const contacto = {
          id: idContacto,
          nombre: contactoData.nombre || 'Sin nombre',
          fotoPerfil: contactoData.fotoPerfil || '../../assets/account_circle.png'
        };

        this.contactoSeleccionado = contacto;
        await this.cargarMensajes(idContacto);
      }
    } catch (error: any) {
      console.error('Error al seleccionar contacto:', error.message);
    }
  }

  async cargarMensajes(idContacto: string): Promise<void> {
    try {
      const db = getDatabase();
      const chatsRef = ref(db, `Chats`);
      const chatsSnap = await get(chatsRef);

      if (chatsSnap.exists()) {
        const chatsData = chatsSnap.val();
        this.mensajes = Object.values(chatsData).filter(
          (mensaje: any) =>
            (mensaje.idEnvia === this.idUsuario && mensaje.idRecibe === idContacto) ||
            (mensaje.idEnvia === idContacto && mensaje.idRecibe === this.idUsuario)
        );
      } else {
        this.mensajes = [];
      }
    } catch (error: any) {
      console.error('Error al cargar mensajes:', error.message);
    }
  }

  async enviarMensaje(): Promise<void> {
    // Validar que el mensaje no esté vacío ni contenga solo espacios en blanco
    if (!this.nuevoMensaje.trim()) {
      alert('El mensaje no puede estar vacío.');
      return;
    }
  
    try {
      const db = getDatabase();
      const chatsRef = ref(db, `Chats`);
  
      // Guardar el mensaje en Firebase
      const mensajeRef = push(chatsRef);
      await set(mensajeRef, {
        idEnvia: this.idUsuario,
        idRecibe: this.contactoSeleccionado.id,
        Mensaje: this.nuevoMensaje.trim(), // Eliminar espacios innecesarios al inicio y final
        fecha: new Date().toISOString()
      });
  
      this.nuevoMensaje = ''; // Limpiar el campo de texto después de enviar
      this.cargarMensajes(this.contactoSeleccionado.id); // Recargar mensajes
    } catch (error: any) {
      console.error('Error al enviar mensaje:', error.message);
      alert('Error al enviar el mensaje.');
    }
  }

  escucharNuevosMensajes(): void {
    const db = getDatabase();
    const chatsRef = ref(db, `Chats`);

    onValue(chatsRef, (snapshot) => {
      const chatsData = snapshot.val();
      if (chatsData) {
        const contactosUnicos: any[] = [];

        Object.values(chatsData).forEach((mensaje: any) => {
          if (mensaje.idRecibe === this.idUsuario || mensaje.idEnvia === this.idUsuario) {
            const idContacto = mensaje.idRecibe === this.idUsuario ? mensaje.idEnvia : mensaje.idRecibe;

            // Verificar si el contacto ya está en la lista
            const contactoExistente = contactosUnicos.find((contacto) => contacto.id === idContacto);
            if (!contactoExistente) {
              // Agregar el nuevo contacto a la lista temporal
              contactosUnicos.push({
                id: idContacto,
                ultimoMensaje: mensaje.Mensaje,
                fechaUltimoMensaje: mensaje.fecha
              });
            } else {
              // Si el contacto ya existe, actualizar su último mensaje
              contactoExistente.ultimoMensaje = mensaje.Mensaje;
              contactoExistente.fechaUltimoMensaje = mensaje.fecha;
            }
          }
        });

        // Cargar datos adicionales de los usuarios (nombre y foto)
        Promise.all(
          contactosUnicos.map(async (contacto) => {
            const contactoRef = ref(db, `Usuario/${contacto.id}`);
            const contactoSnap = await get(contactoRef);

            if (contactoSnap.exists()) {
              const contactoData = contactoSnap.val();
              contacto.nombre = contactoData.nombre || 'Sin nombre';
              contacto.fotoPerfil = contactoData.fotoPerfil || '../../assets/account_circle.png';
            }
          })
        ).then(() => {
          // Asignar la lista de contactos única
          this.contactos = contactosUnicos;
        });
      }
    });
  }
}