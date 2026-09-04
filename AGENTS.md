# AGENTS.md — Instrucciones para agentes de IA en Creatorly

> Archivo compartido, committeado en la raíz del repo. Lo lee cualquier agente que asista a **cualquiera de los 3 integrantes del Equipo 7** (Kevin Pabón, Felipe Gómez, Gerónimo Montes) al arrancar — sin importar si esa persona usa agentes de IA de forma habitual o no. `CLAUDE.md` es solo un import de este archivo (`@AGENTS.md`); si se edita este, no hace falta tocar `CLAUDE.md`.

## 1. Qué es este archivo y para quién

Este archivo es el **piso obligatorio para cualquier agente que trabaje en este repo, no el techo**. Cada integrante puede además mantener su propio archivo personal de instrucciones (por ejemplo, `CLAUDE.local.md` de Kevin, excluido del repo vía `.git/info/exclude`) con sus preferencias propias de cómo trabajar con su agente: su ritmo, su cadencia de revisión, su propia bitácora. Un archivo personal puede **sumar reglas más estrictas**, nunca contradecir ni aflojar una regla de este archivo. Si algún día un archivo personal y este se contradicen, **manda este**.

Nada en este archivo asume si Kevin, Felipe o Gerónimo usan un agente de IA para su parte del proyecto, ni lo asume distinto entre ellos. Las reglas de abajo aplican igual en cualquier caso.

## 2. El proyecto en 30 segundos

**Creatorly** es un dashboard SPA (Vue 3 + Vite + TypeScript) para la operación de una agencia de creadores UGC: catálogo de **Creadores**, **Marcas** clientes y **Pedidos** que las conectan. La "base de datos" es el LocalStorage del navegador con datos semilla. El glosario oficial del dominio está en `CONTEXT.md` — úsalo para hablar del dominio sin ambigüedad; las decisiones de arquitectura ya tomadas están en `docs/adr/`.

## 3. Fuentes de verdad, en orden de lectura

1. **Este archivo** — reglas obligatorias de código y de trabajo con agentes.
2. **`CONTEXT.md`** — glosario del dominio.
3. **`docs/adr/`** — decisiones de arquitectura ya tomadas, y por qué.
4. **El código** — si algo de aquí no coincide con lo que hay en `src/`, el código manda y este archivo quedó desactualizado; repórtalo en vez de asumir.

## 4. Comandos

```sh
npm install        # requiere autorización explícita de Kevin — ver sección 10
npm run dev         # servidor de desarrollo (Vite)
npm run lint        # oxlint + eslint, ambos con --fix
npm run format      # prettier sobre src/
npm run type-check  # vue-tsc: verificación de tipos
npm run build       # build de producción (incluye type-check)
```

Requisito: **Node 22+** (lo exige `engines` en `package.json`).

## 5. Arquitectura: las cinco piezas del patrón

Cada entidad del dominio se parte en hasta cinco archivos. Este es el molde completo — no negociable, es el que audita el profesor:

```ts
// interfaces/PedidoInterface.ts → LA FORMA. Solo atributos, sin métodos.
export interface PedidoInterface { id: string; descripcion: string; /* ... */ }

// dtos/CreatePedidoDTO.ts → un tipo derivado por caso de uso, con Omit/Pick.
export type CreatePedidoDTO = Omit<PedidoInterface, 'id' | 'createdAt' | 'updatedAt'>;

// stores/PedidoStore.ts → SOLO EL ARRAY. Cero lógica.
export const usePedidoStore = defineStore('pedido', () => {
  const pedidos = ref<PedidoInterface[]>([]);
  return { pedidos };
});

// services/PedidoService.ts → TODA LA LÓGICA. Clase de métodos estáticos.
export class PedidoService {
  static getAll(): PedidoInterface[] { return usePedidoStore().pedidos; }
  static create(datos: CreatePedidoDTO): PedidoInterface { /* valida, genera id, persiste */ }
}

// seeders/PedidoSeeder.ts → datos ficticios, objetos planos tipados (no instancias de clase).
export function seedPedidos(marcas: MarcaInterface[], /* creadores, users */): PedidoInterface[] {
  return [ /* ... */ ];
}
```

Hoy el proyecto real tiene 4 `interfaces/`, 6 `dtos/`, 5 `stores/`, 6 `services/` y 4 `seeders/` — uno por entidad (`User`, `Creador`, `Marca`, `Pedido`), salvo que `PedidoSeeder` recibe las otras tres colecciones ya sembradas como parámetros, para referenciarlas por id (ver ADR-0001), y que `services/` suma `StorageService` y `AuthService` además de los cuatro por entidad. Las validaciones (presupuesto ≥ 0, estado válido, formato de email, campos obligatorios) viven siempre en el service, nunca en la interface. Antes de crear un archivo nuevo, revisa si ya existe una de estas cinco piezas para la entidad que necesitas — el patrón se reusa, no se reinventa por página.

**`utils/`** es la sexta pieza que la rúbrica del profesor menciona explícitamente (ADR-0004: *"interfaces/, dtos/, stores/, services/, utils/"*), pero hoy no existe en el proyecto real — cero archivos, verificado. Mismo tratamiento que `components/charts/` en la regla 8 de la sección 6: se documenta por adelantado aunque la carpeta nazca vacía. Ahí van los formateadores puros — funciones sin estado ni acceso a stores/LocalStorage, del tipo `formatCurrency.ts`/`formatDate.ts`, reusadas por más de una view o component. No inventes contenido para llenarla antes de que alguien la necesite.

## 6. Reglas de código (obligatorias en todo lo que produzcas)

1. **TypeScript en todo**: archivos `.ts`, SFCs con `<script setup lang="ts">`. Nada de `.js` nuevo.
2. **Tipos explícitos** en todo parámetro y retorno de función o método. Prohibido `any` sin justificación escrita en comentario.
3. Una ruta → una vista SFC en `views/`; componentes reutilizables en `components/` (PascalCase). **No se crean composables**: la lógica va a `services/`.
4. **Nadie toca `localStorage` directamente**: siempre vía `services/StorageService.ts` (ADR-0001).
5. **Las views no tocan los stores**: solo hablan con services.
6. **Un DTO por caso de uso**, derivado de su interface con `Omit`/`Pick`. Varios DTOs en un service está bien; un DTO partido en dos, no.
7. Los ids se generan con `crypto.randomUUID()`; los pedidos referencian marca/creador/coordinador **por id** (ADR-0001).
8. **Ningún gráfico dentro de una view**: todo Chart.js vive en `components/charts/` (ADR-0003) — esto además es un criterio explícito de la rúbrica del profesor, no una preferencia de estilo.
9. Estilos: variables de marca de `src/assets/base.css`; nada de colores mágicos.
10. **DRY y ETC**: extrae componentes/servicios antes de duplicar; escribe código fácil de cambiar.

La convención de mensajes de commit vive en la sección 10 (Política de git), no aquí — es una regla de proceso, no de código.

## 7. Convenciones de archivo (el profesor las revisa en sustentación)

**Encabezado:** primera línea de cada archivo, comentario con el nombre de quien lo escribió — el autor puede ser cualquiera de los 3 integrantes, no asumas que es siempre el mismo.

**Imports agrupados, alfabéticos dentro de cada grupo:**

```ts
// Nombre de quien escribe el archivo

// external imports
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

// internal imports
import type { PedidoInterface } from '@/interfaces/PedidoInterface';
import { PedidoService } from '@/services/PedidoService';
```

**Secciones dentro de las views** (el profesor pregunta explícitamente por selectores y variables computadas):

```ts
// selectors
// computed variables
// functions
```

**Nombres sin ambigüedad.** Nada de `d`, `p`, `i`, `data`, `temp`. En callbacks: `(pedido) =>`, no `(p) =>`.

## 8. Cómo debe trabajar un agente en este repo

Ayudar no es generar y pegar. Cualquier agente que asista a un integrante en este repo debe, en cada tarea:

1. **Explicar qué cambió y por qué**, en términos que el integrante pueda repetir sin el agente delante.
2. **Poder ser cuestionado sobre una decisión de diseño** y dar una razón real — "porque así lo hizo el agente" no es una respuesta válida en sustentación.
3. **Correr `npm run lint`, `npm run type-check` y `npm run build` en verde antes de proponer un commit** — no después, no "lo arreglamos en el siguiente".
4. Recordar que el criterio de aceptación no es "compila": es que **la persona pueda defender ese código en su nota individual**, que multiplica la del equipo. Un agente que no deja a su integrante en esa posición no terminó la tarea, aunque el build pase.

## 9. Alcance de un agente: qué puede y no puede tocar

Un agente que trabaja en este repo opera **solo dentro de la rama y el alcance del integrante al que asiste**. No toca, "corrige" ni reescribe código de otro integrante por iniciativa propia, ni siquiera si el cambio parece obviamente correcto o el código ajeno está incompleto — eso pasa por PR y revisión, igual que cualquier otro cambio a `main`, sin excepción por tratarse de código sin terminar o de que quien lo escribió no esté usando IA en ese momento. La barrera es el PR, no si hay un humano o un agente al otro lado del cambio.

## 10. Política de git

- ✅ **Commits locales permitidos** (en rama, jamás directo en `main`).
- ✅ **Antes de cualquier commit:** correr `npm run lint`, `npm run format` y `npm run type-check`. Si `format` modifica archivos, esos cambios van incluidos en el mismo commit. **No commitear con lint en rojo ni con errores de tipos.**
- **Commits:** tipo en inglés + descripción en español (`feat: agrega guard de rutas admin`). Cuerpo en viñetas cortas, solo hechos técnicos verificables — qué se creó/borró/movió, una decisión de diseño con su motivo, una línea de verificación. **Filtro antes de proponer cualquier commit: si una frase describe el código, se queda; si describe la conversación o le habla a una persona ("confirmado con X", "a partir de este commit el equipo puede..."), se va.** Eso vive en la comunicación aparte del equipo, nunca en el mensaje de commit.
- ❌ **Push y crear PR: requieren autorización explícita y por escrito del integrante para quien trabaja el agente**, pedida antes de ejecutar. Que el entorno muestre un diálogo de permisos y la persona le dé "allow" no es autorización: el agente debe haberla pedido antes, en texto, como parte de su tarea.
- ❌ **Aprobar y mergear un PR a `main`: siempre Kevin**, como arquitecto del equipo — autoridad que le da el enunciado del curso (ver ADR-0002). Esto no cambia según quién use o no un agente.
- ❌ **Instalar o actualizar dependencias (`package.json`/`package-lock.json`): autorización explícita y previa de Kevin**, sin importar en qué rama se necesite. Una dependencia nueva afecta el build de los 3 integrantes, no solo la rama de quien la pide — pesa como un merge a `main`, no como un push de rama propia.
- ⛔ Nunca `push --force`, nunca tocar `main` directo, nunca reescribir historial ya publicado.
- Al terminar una tarea: listar los archivos tocados y pedir por escrito la autorización para lo que siga (push/PR).

## 11. Mantenimiento de este archivo

Un cambio a este archivo sigue el mismo flujo que cualquier otro archivo del repo: rama + Pull Request, con la aprobación de Kevin como arquitecto — no se edita directo, aunque quien lo proponga esté seguro de que hace falta.

Para agregar un ADR nuevo en `docs/adr/`: se justifica cuando la decisión cumple los tres criterios de siempre — es difícil de revertir, sería sorprendente sin el contexto escrito, y hay un trade-off real que alguien más podría cuestionar en sustentación. Un ADR nuevo también va por PR.
