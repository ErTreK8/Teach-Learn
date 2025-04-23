import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, ref, push, set, get, update } from 'firebase/database';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import BadWordsFilter from 'bad-words'; // Importar el módulo correctamente

@Component({
  selector: 'app-resenya',
  templateUrl: './resenya.component.html',
  styleUrls: ['./resenya.component.css']
})
export class ResenyaComponent implements OnInit {
  idClase: string | null = null; // ID de la clase
  nota: number = 0; // Nota de la reseña
  comentario: string = ''; // Comentario de la reseña
  userId: string | null = null; // ID del usuario

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idClase = this.route.snapshot.paramMap.get('idClase'); // Obtener el ID de la clase desde la URL
    this.userId = localStorage.getItem('idUsr'); // Obtener el ID del usuario desde localStorage
  }

  async enviarResenya(): Promise<void> {
    try {
      if (!this.idClase || !this.userId) {
        throw new Error('ID de clase o usuario no encontrado.');
      }
  
      if (this.nota < 1 || this.nota > 10) {
        alert('La nota debe estar entre 1 y 10.');
        return;
      }
  
      // Validar el comentario usando bad-words
      const esInapropiado = this.validarComentarioConBadWords(this.comentario);
      if (esInapropiado) {
        alert('El comentario contiene lenguaje inapropiado. Por favor, revisa tu texto.');
        return;
      }
  
      if (!getApps().length) {
        initializeApp(environment.fireBaseConfig);
      }
  
      const db = getDatabase();
  
      // Obtener los detalles de la clase para calcular la duración
      const claseRef = ref(db, `Classes/${this.idClase}`);
      const claseSnapshot = await get(claseRef);
  
      if (!claseSnapshot.exists()) {
        throw new Error('La clase no existe.');
      }
  
      const claseData = claseSnapshot.val();
      const fechaInicio = new Date(claseData.dataInici);
      const fechaFin = new Date(claseData.dataFi);
  
      // Calcular la duración de la clase en horas
      const duracionEnHoras = (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60);
  
      // Calcular los TeachCoins (enteros, máximo 50)
      const teachCoinsOtorgados = Math.min(50, Math.floor(this.nota * duracionEnHoras));
  
      // Guardar la reseña en Firebase
      const resenyaRef = ref(db, `Resenyas`);
      const nuevaResenyaKey = push(resenyaRef).key;
  
      if (!nuevaResenyaKey) {
        throw new Error('Error al generar la clave de la reseña.');
      }
  
      // Guardar la reseña en el nodo Resenyas
      await set(ref(db, `Resenyas/${nuevaResenyaKey}`), {
        Nota: this.nota,
        Resenya: this.comentario,
        idUsuario: this.userId // Añadimos el ID del usuario
      });
  
      // Asociar la reseña con la clase en ResenyasClase
      await set(ref(db, `ResenyasClase/${nuevaResenyaKey}`), {
        IdResenyaClase: nuevaResenyaKey,
        idClase: this.idClase,
        idResenya: nuevaResenyaKey,
        idUsuario: this.userId // Añadimos el ID del usuario aquí también
      });
  
      // Actualizar el estado de "acabada" en ClaseAlumno
      const claseAlumnoRef = ref(db, `ClaseAlumno`);
      const claseAlumnoSnapshot = await get(claseAlumnoRef);
  
      if (claseAlumnoSnapshot.exists()) {
        const clasesData: Record<string, any> = claseAlumnoSnapshot.val();
        const key = Object.keys(clasesData).find(
          (key) => clasesData[key].idClase === this.idClase && clasesData[key].idUsuario === this.userId
        );
  
        if (key) {
          // Actualizar el estado "acabada" a true
          await set(ref(db, `ClaseAlumno/${key}/acabada`), true);
        }
      }
  
      // Sumar TeachCoins al profesor
      const idProfesor = claseData.idProfesor;
  
      await this.agregarTeachCoinsAlProfesor(idProfesor, teachCoinsOtorgados); // Llama a la función para añadir TeachCoins
  
      alert('Reseña enviada exitosamente.');
      this.router.navigate(['/home']); // Redirigir al home
    } catch (error: any) {
      console.error('Error al enviar la reseña:', error.message || error);
      alert('Error al enviar la reseña. Por favor, intenta de nuevo.');
    }
  }
  async agregarTeachCoinsAlProfesor(idProfesor: string, teachCoinsOtorgados: number): Promise<void> {
    try {
      const db = getDatabase();
      const profesorRef = ref(db, `Usuario/${idProfesor}`);
      const profesorSnapshot = await get(profesorRef);
  
      if (profesorSnapshot.exists()) {
        const profesorData = profesorSnapshot.val();
        const nuevosTeachCoins = (profesorData.teachCoins || 0) + teachCoinsOtorgados;
  
        // Actualizar los TeachCoins del profesor
        await update(profesorRef, { teachCoins: nuevosTeachCoins });
        console.log(`Se han añadido ${teachCoinsOtorgados} TeachCoins al profesor con ID: ${idProfesor}`);
      } else {
        throw new Error('El profesor no existe en la base de datos.');
      }
    } catch (error: any) {
      console.error('Error al añadir TeachCoins al profesor:', error.message || error);
      throw error; // Propagar el error si es necesario
    }
  }

  validarComentarioConBadWords(comentario: string): boolean {
    // Crear una instancia del filtro
    const filter = new BadWordsFilter();

    // Agregar palabras inapropiadas en español ya que el bad Words sirve solo para el ingles
    const palabrasInapropiadasEnEspanol = [
      'basura', 'idiota', 'incompetente', 'estúpido', 'imbécil', 'mierda',
      'gilipollas', 'cabrón', 'puta', 'hijo de puta', 'maricón', 'zorra',
      'pendejo', 'chingar', 'coño', 'verga', 'culo', 'tonto', 'tarado',
      'chupapollas', 'desgraciado', 'pinche', 'huevón', 'mamón', 'chingada',
      'gonorrea', 'baboso', 'insignificante', 'subnormal', 'cretino', 'animal',
      'bruto', 'calientapollas', 'chulo', 'descerebrado', 'engreído', 'estúpido',
      'farsante', 'gandul', 'granuja', 'grosero', 'haragán', 'hipócrita',
      'inmaduro', 'irresponsable', 'ladrón', 'mentiroso', 'mezquino', 'patán',
      'perdedor', 'pesado', 'pesetero', 'podrido', 'prostituta', 'ramera',
      'rata', 'sucio', 'traidor', 'vago', 'vándalo', 'vicioso', 'vulgar',
      'apestoso', 'bastardo', 'borracho', 'caca', 'cagada', 'cobarde',
      'corrupto', 'cretino', 'desgracia', 'despreciable', 'escoria', 'fracasado',
      'furcia', 'gamberro', 'gorrón', 'guarro', 'hijueputa', 'horrible',
      'indecente', 'insufrible', 'ladilla', 'lameculos', 'lunático', 'malnacido',
      'malparido', 'maldito', 'manipulador', 'miserable', 'naco', 'narcisista',
      'nazi', 'nefasto', 'niñato', 'odioso', 'payaso', 'pederasta', 'pelele',
      'perverso', 'polla', 'primate', 'puerca', 'puerco', 'rastrero', 'repugnante',
      'ridículo', 'sapo', 'sinvergüenza', 'soplón', 'tacaño', 'tramposo',
      'trolo', 'trolero', 'urraca', 'vándala', 'venenoso', 'vil', 'zafio',
      'zopenco', 'aborto', 'albino', 'apestado', 'arrastrado', 'arruinado',
      'asqueroso', 'atrasado', 'avaro', 'bajuno', 'baratero', 'bestia', 'bobo',
      'boludo', 'bribón', 'brutal', 'burro', 'cadáver', 'calabaza', 'calvo',
      'camello', 'caradura', 'casposo', 'cerdo', 'chiflado', 'chivato', 'chocho',
      'chuleta', 'comemierda', 'corruptela', 'crápula', 'cutre', 'desalmado',
      'desastre', 'desnutrido', 'diablo', 'difunto', 'drogadicto', 'embustero',
      'endemoniado', 'engañoso', 'envidioso', 'esclavo', 'espantajo', 'fanfarrón',
      'farsa', 'feo', 'fetén', 'fétido', 'fraude', 'fulano', 'gangrena', 'gargola',
      'gatillazo', 'golfa', 'gordo', 'guayaba', 'hambre', 'heces', 'hereje',
      'hermafrodita', 'hiperactivo', 'horca', 'huérfano', 'ilegal', 'imbecilidad',
      'impotente', 'incapaz', 'infecto', 'inferior', 'infinito', 'infierno',
      'intruso', 'jactancioso', 'judas', 'lagarto', 'lampiño', 'latoso', 'lelo',
      'lezama', 'libertino', 'liendre', 'lisiado', 'llorica', 'loro', 'lumpen',
      'machista', 'macarra', 'mafioso', 'majadero', 'malandrín', 'malcriado',
      'malévolo', 'manco', 'mangante', 'maquiavélico', 'mariconazo', 'matón',
      'medroso', 'mequetrefe', 'merdellón', 'metiche', 'milenario', 'miseria',
      'momia', 'monigote', 'monstruo', 'moribundo', 'muermo', 'muerto', 'necio',
      'negativo', 'nihilista', 'noob', 'ojete', 'ordeñador', 'ortiga', 'palurdo',
      'panocha', 'parásito', 'pasivo', 'patético', 'pecador', 'pelafustán',
      'pelanas', 'pelotudo', 'pérfido', 'persona non grata', 'pesetero', 'petardo',
      'picapleitos', 'pichabrava', 'pingüino', 'piojoso', 'pirata', 'plasta',
      'polete', 'polizón', 'porquería', 'portador', 'poseído', 'prepotente',
      'primario', 'profanador', 'provocador', 'pueril', 'pulga', 'punzón',
      'quejica', 'quemado', 'rabioso', 'raja', 'rapaz', 'ratonera', 'rebelde',
      'rencoroso', 'retrasado', 'revoltoso', 'ruin', 'sabandija', 'sacrílego',
      'salido', 'satánico', 'semental', 'sicario', 'sifilítico', 'siniestro',
      'soez', 'sodomita', 'soso', 'tabernario', 'tacañería', 'tarambana',
      'tenebroso', 'terrorífico', 'testarudo', 'timador', 'tipejo', 'traficante',
      'trapisonda', 'trepa', 'tristeza', 'truhán', 'tullido', 'turbio', 'ultraje',
      'usurero', 'vacío', 'vampiro', 'vejestorio', 'ventrílocuo', 'vergonzoso',
      'vicario', 'víbora', 'viciosamente', 'violador', 'virgen', 'voluble',
      'yegua', 'zahareño', 'zalamero', 'zancudo', 'zanja', 'zarandaja', 'zombi'
    ];

    palabrasInapropiadasEnEspanol.forEach((palabra) => filter.addWords(palabra));

    // Verificar si el comentario es inapropiado
    const esInapropiado = filter.isProfane(comentario);

    console.log('¿Es inapropiado?', esInapropiado);

    return esInapropiado;
  }
}