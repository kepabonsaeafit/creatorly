# Plan de corrección — Entregable 1 (Creatorly) — v5

> v1-v3: ver historial. v4: reubicación de DemoDataService + límite explícito con el backend. v5: incorpora la segunda revisión de Claude Code (búsqueda de puntos ciegos) — corrige 2 errores propios (Seeders mal archivado, secuencia que rompe type-check), agrega hallazgos nuevos (CI/tests, datos ya persistidos en GCP, un bug funcional real), y dos decisiones grandes que quedaban sin resolver.

**⚠️ Antes de ejecutar nada:** confirmar que este archivo reemplaza físicamente `docs/plan-correccion-entregable1.md` en el repo — el que hay hoy en disco es la v1 y contradice varias decisiones ya tomadas (utils como clase, `// filtro`, instalar librería nueva).

**Decisiones grandes ya resueltas en esta versión:**
- **Los nombres de entidad SÍ se traducen** (`Pedido`→`Order`, `Marca`→`Brand`, `Creador`→`Creator`; `User` ya está en inglés) — esto multiplica el alcance real de la sección 12 más allá de los 582 campos ya contados: archivos, carpetas de contenido, rutas y vistas de las 3 entidades.
- **La rama `ci/github-actions-vitest` queda fuera de este plan.** Es un taller de otra materia (Pruebas de Software), no forma parte de Creatorly ni de Ingeniería de Software Web — se deja aislada tal cual está, sin mergear ni tocar. Todo lo que este documento tenía anotado sobre actualizar tests o decidir el CI queda sin efecto: esos archivos no existen en `main`.

**Leyenda de triage:**
- 🟢 **Estable** — sobrevive al backend sin cambios de fondo. Corregir a fondo ahora.
- 🟡 **Limpieza mínima** — la capa completa se apaga o se borra en tutorial-7. Solo lo indispensable para esta sustentación.
- **Aclaración (respuesta a un hallazgo del reporte):** que `StorageService`/`DemoDataService` salgan de `services/` es 🟢 — es una corrección arquitectónica permanente (regla de una entrega anterior), no depende del backend. Lo que sí es 🟡 es el *contenido interno* de esa capa (los métodos de `StorageService`, el patrón de `PiniaConfig`) — eso sí se apaga pronto. Es la reclasificación la que es estable, no el código que reclasifica.

**Alcance de este documento — no mezclar con el backend.** Todo esto es corrección de la Entregable 1 tal como existe hoy (LocalStorage, sin backend). 🟡 significa "no sobre-invertir", no "empecemos esa parte del backend". Tutoriales 6-7 son una fase aparte, después de cerrar esta corrección por completo.

---

## 1. Diagramas (Lucidchart — Kevin) 🟢

**Corregido: la sección se contradecía sola (pedía inglés y listaba nombres en español).**

**Diagrama de clases**
- [ ] Traducir todo al inglés — **nombres de clase confirmados: `User`, `Creator`, `Brand`, `Order`** (no `Creador`/`Marca`/`Pedido`)
- [ ] Cambiar visibilidad de atributos de `+` a `-`
- [ ] Agregar compartimento de métodos `+ CRUD()` / `+ getters()` / `+ setters()` — solo notación de diagrama
- [ ] Quitar flechas direccionadas — líneas simples con multiplicidad
- [ ] Renombrar `coordinadorId` → `userId`
- [ ] **Dibujar el diagrama contra la estructura ya corregida, no la actual** — para cuando se haga esto, `services/` baja de 7 a 5 archivos, `interfaces/` crece de 4 a ~10 (con `HomeStat`, `PedidoActivity`, `LoginResult`, etc. movidos ahí)

**Diagrama de arquitectura**
- [ ] Renombrar cajas a `Client`/`Server`, en inglés
- [ ] Agregar leyenda de colores y del formato `(n)`
- [ ] Agregar el 5to util faltante: `generateId.ts`
- [ ] Listar los 11 DTOs uno por uno, no agrupados
- [ ] No mostrar `.ts` como si vivieran dentro del navegador en ejecución
- [ ] Mismo criterio que el diagrama de clases: dibujar contra la estructura final (con `src/storage/` nuevo, `services/` reducido)

---

## 2. Documentación — wiki y archivos de agentes de IA 🟢

- [ ] Separar ESLint+oxlint de Prettier como dos herramientas, con qué es/cómo se usa/dónde se usa/cuándo se usa
- [ ] Corregir "un solo comando" → son dos (`lint`, `format`)
- [ ] Corregir "cuándo se usa" → antes de cada commit — **el mismo error aparece en 3 lugares más, no solo en la guía de estilo:** `reglas-de-programacion.md` regla 24 (dice "lint, type-check y build antes del PR", sin mencionar format), el paso 7 de "Cómo agregar una entidad" (mismo texto), y `AGENTS.md` se contradice consigo mismo (:117 pide lint/type-check/build, :127 pide lint/format/type-check) — corregir los 4 lugares a la vez
- [ ] Traducir a inglés (wiki + `AGENTS.md` + `CLAUDE.local.md`)
- [ ] Regla de ids: corregir en los 3 lugares que dicen `crypto.randomUUID()` directo (regla 17 wiki, regla 7 `AGENTS.md`, regla 7 `CLAUDE.local.md`)
- [ ] Regla de services: agregar "nada de constantes ni funciones a nivel de módulo"
- [ ] Regla de stores: **nueva — es falsa.** Dice "solo el array, cero lógica", pero `SessionStore.ts:13-24` tiene 3 `computed`, lee `StorageService` e importa `UserService`. Corregir el texto o el código — recomendado corregir el texto, ya que un store leyendo la sesión es razonable
- [ ] Regla de DTOs: **nueva — es falsa.** Dice "tipos derivados con `Omit`/`Pick`", pero 6 de los 11 DTOs no derivan (los de filtro y agregación son `interface` sueltas, y lo dicen en su propio comentario). Los DTOs tienen "Muy bien" en la rúbrica — **corregir el texto de la regla, no los DTOs**
- [ ] Regla de seeders "función pura": **nueva — es falsa en sentido estricto.** Los 4 seeders llaman `generateId()`, que es aleatorio — no son puros. Si el profesor pregunta qué es una función pura, esto puede salir mal en la sustentación. Ajustar el texto de la regla para reflejar la realidad (función que no muta nada externo, no "pura" en el sentido matemático estricto)
- [ ] Regla "no colores mágicos": **nueva — es falsa.** Hay 13 apariciones de `#ffffff` en 12 SFCs, más 2 `rgba()` y 2 atributos SVG hardcodeados en `NavBar.vue`, existiendo ya `--brand-white` en `base.css`. **Aquí sí se corrige el código**, no la regla (ver sección 13)
- [ ] Quitar o reescribir la regla 3 (permite español en dominio)
- [ ] Regla de composables: quitarla o dejarla con su justificación real
- [ ] `AGENTS.md:64` (no `:66` — corregido el número de línea): conteos desactualizados (dice que `utils/` no existe; dice 6 dtos y 6 services cuando son 11 y 7; dice que `services/` incluye `StorageService`)
- [ ] `CLAUDE.md` debe ser el import real de `AGENTS.md`
- [ ] ADR-0001: corregir la cita a `PiniaConfig.init()` → `initPinia()`
- [ ] **Mover `StorageService` — lista completa de documentos a actualizar, no solo ADR-0001 y regla 18:** `AGENTS.md:73` (regla 4), `AGENTS.md:64` ("services/ suma StorageService"), regla 4 de `CLAUDE.local.md`, `guia-de-estilo.md:36,49` (pone a `StorageService` como ejemplo de service), `docs/wiki/entregable.md:66`
- [ ] ADR-0003: resolver si `vue-toastification` cuenta como segunda librería
- [ ] `CONTEXT.md`: actualizar para reflejar los nombres en inglés — ya no es condicional, la traducción del dominio está confirmada
- [ ] ~~¿`npm test` y CI entran en la guía?~~ **Resuelto: no aplica.** `ci/github-actions-vitest` es de otra materia, queda fuera de este plan
- [ ] `docs/findings-timezone.md:83-87` pospone un arreglo de zona horaria "para no mezclar con el periodo de calificación / regenerar `dist/`" — **esa razón ya no aplica**, porque el plan va a regenerar `dist/` de todas formas. Decidir si ese arreglo entra a esta corrección (ver sección de bugs funcionales)

---

## 3. Código — Services 🟢

- [ ] Mover los 4 `validate()` sueltos (`MarcaService.ts:11`, `CreadorService.ts:10`, `UserService.ts:14`, `PedidoService.ts:41`) adentro de sus clases
- [ ] Mover las constantes sueltas relacionadas — coordinar con la sección 13 antes de decidir dónde quedan
- [ ] Mover `HomeStat`/`PedidoActivity` de `PedidoService.ts` a `interfaces/`
- [ ] **`StorageService`: mover fuera de `services/` a `src/storage/StorageService.ts`.** Al moverlo, mover también sus propias constantes sueltas (`KEYS`, `SESSION_KEY`) adentro de la clase — tienen el mismo patrón "constantes y luego clase" que se señaló en `MarcaService`. **Ejecutar este paso junto con la eliminación de `DemoDataService.ts` (sección 8) en el mismo commit** — si se hacen por separado, mover `StorageService` primero rompe `type-check` porque `DemoDataService.ts` (que todavía existe) lo importa. Consumidores finales, después de que `DemoDataService.ts` ya no exista: **3** (`PiniaConfig.ts`, `AuthService.ts`, `SessionStore.ts`)
- [ ] `DemoDataService.ts`: se elimina de `services/` por completo — ver sección 8 para el destino y el motivo completo
- [ ] **DECISIÓN, no tiene un default seguro:** `AuthService.ts:32,38` (`setSession`/`clearSession`) y `SessionStore.ts:13` (lee storage) siguen siendo trabajo de storage dentro de la capa de services/stores, aunque ya no toquen `StorageService` incorrectamente clasificado. ¿Se persiste la sesión igual que las colecciones (con un `watch` en `PiniaConfig`), o se deja como excepción documentada (parecido al guard del router, que ya es una excepción aceptada)? Recomendación: dejarlo como excepción documentada — el ciclo de vida de sesión (login/logout) es un concern de service legítimo, distinto a CRUD de colecciones — pero hay que escribirlo explícito en `entregable.md`, no dejarlo implícito

---

## 4. Código — Interfaces 🟢

- [ ] Renombrar `coordinadorId` → `userId`. Confirmado: 4 archivos de `src/`, 22 líneas, 28 ocurrencias
- [ ] **Tres efectos que el plan no cubría, hay que resolverlos en el mismo commit del rename:**
  1. ~~**Pruebas:** `PedidoService.spec.ts:23` usa `coordinadorId`~~ **No aplica** — ese archivo vive solo en `ci/github-actions-vitest` (otra materia), no en `main`
  2. **Datos ya persistidos:** cualquier navegador con datos viejos en LocalStorage (**incluido el sitio ya desplegado en GCP que el profesor puede tener abierto**) sigue teniendo el campo `coordinadorId`. Después del rename, `pedido.userId` queda `undefined`, `validate()` falla al editar, y `ensureSeeded()` no vuelve a sembrar porque ya hay datos. **Estrategia recomendada:** versionar la clave de esa colección en `StorageService` (ej. `creatorly_pedidos_v2`) para que los navegadores viejos simplemente vuelvan a sembrar en vez de cargar datos con la forma vieja — es el mismo patrón que ya vimos en el ejemplo de la inmobiliaria (`SEED_FLAG = 'keyring_seeded_v2'`)
  3. **Colisión semántica:** `userId` ya significa "el usuario de la sesión actual" en `SessionStore.ts`, `SessionRecord` y `StorageService.setSession(userId)`. Renombrar `coordinadorId` a lo mismo puede generar confusión entre "el usuario coordinador de este pedido" y "el usuario logueado". **No es algo para decidir solos** — vale la pena mencionárselo al profesor junto con las otras preguntas abiertas, ya que la rúbrica pidió literalmente ese nombre
- [ ] El rename arrastra `PedidoService.getCoordinador()`, `const coordinadores` en `PedidoForm.vue`, `id="coordinador"` + su `<label>` — decidir si el rename es solo del campo o del concepto completo

---

## 5. Código — Utils 🟢

Sin cambios — decisión de v3 confirmada correcta por la segunda revisión (no hay ninguna clase en `utils/` hoy). El único pendiente es asegurarse de que el archivo en disco refleje esta decisión (ver nota de arriba sobre la v1 desactualizada).

---

## 6. Código — Views y lógica de negocio fuera de lugar 🟢

- [ ] **"hacen ordenamiento en views, debería en services"** → mover `.sort()` de `PedidosIndexView.vue`, `UsuariosView.vue`, `CreadoresIndexView.vue`
- [ ] **"ordenar alfabéticamente las importaciones"** → las 10 vistas están bien; el problema real está en `AuthService.ts` y `PedidoService.ts`
- [ ] **"selector nada que ver con selectores" — resuelto: significa literalmente un `<select>` desplegable, nada abstracto.** Con esa definición, verificado contra el template de cada uno de los 14 archivos:
  - **3 casi completos, solo falta separar el campo que no es select:** `PedidosIndexView.vue` (`filtro.texto` no es select), `CreadoresIndexView.vue` (`filtro.texto` no es select), `ReportesView.vue` (`filtro.desde`/`filtro.hasta` no son select)
  - **2 con selectores reales mezclados con campos que no lo son — separar en dos comentarios:** `PedidoForm.vue` (`marcaId`/`creadorId`/`coordinadorId`/`estado` sí; `descripcion`/`presupuesto`/`fechaSolicitud` no), `UsuarioForm.vue` (`rol` sí; `nombre`/`email`/`password` no)
  - **9 completamente mal, quitar `// selectors` y usar otra etiqueta:** `CreadorForm.vue`, `NavBar.vue`, `BaseChart.vue`, `LoginView.vue`, `UsuariosView.vue`, `PedidosCreateView.vue`, `PedidosEditView.vue`, `CreadoresCreateView.vue`, `CreadoresEditView.vue`
  - **Nota aparte, no es una corrección de este punto pero vale la pena tenerla anotada:** en `CreadorForm.vue`, `nicho` es texto libre al crear, pero `CreadoresIndexView.vue` filtra por `nicho` con un `<select>` de opciones fijas — alguien puede escribir un nicho que nunca aparezca en ese filtro
- [ ] **"organizar mucho mejor el código"** → respondido en conjunto por duplicación (sección 13), lógica mal ubicada, y referencias muertas (sección 9):
  - [ ] `UsuariosView.vue:59-65` y `:87-90` — reglas de sesión en la vista → mover a `UserService`
  - [ ] `NavBar.vue:44` (`esAdmin`) duplica `SessionStore.isAdmin` — **dejar una sola fuente: `AuthService.isAdmin()` leyendo del store, no al revés.** `SessionStore.ts:21-23` documenta que `isAdmin` se dejó inline a propósito para evitar un ciclo de imports con `AuthService` — la dirección correcta es que `AuthService` dependa del store, no que el store dependa de `AuthService`
  - [ ] `ActivityItem.vue:17-20` y `StatCard.vue:19` — ver sección 7, estas dos correcciones causan regresión si se aplican tal cual
- [ ] **Nuevo, menor:** `ReportesView.vue:67-117` arma columnas/filas según el tipo de reporte — 50 líneas de lógica de presentación en la vista, caso límite, no urgente
- [ ] **Nuevo, cuidado al ejecutar la sección 13:** `PedidosIndexView.vue` colorea por índice asumiendo que el orden de `getChartPalette()` coincide con el orden de `ESTADOS` — al deduplicar `ESTADOS` (sección 13), preservar ese orden o el color de cada estado cambia sin querer

---

## 7. Código — Components 🟢

- [ ] Mover `HomeStat`/`PedidoActivity` a `interfaces/`; actualizar imports en `ActivityList.vue`/`StatCardGrid.vue`
- [ ] Mismo problema en más sitios: `CollectionName`/`SessionRecord`, `LoginResult`, `ReportTableColumn`, `TipoReporte`/`OpcionReporte`, `NavLink` — **y uno que faltaba: `DatosPedidoSeed` (`PedidoSeeder.ts:12`)**. `DatosSiembra` se queda en `PiniaConfig.ts` junto con `generar()`/`persistir()` — no es una excepción a la regla, es que `PiniaConfig.ts` no es un component ni un service, así que no aplica el mismo criterio
- [ ] `PedidoForm.vue:46-48` filtra usuarios por rol en el componente → mover a `UserService.getCoordinadores()`
- [ ] Quitar `Puerto de composables/useHomeStats.js` — 2 ocurrencias (parte de la sección 9)
- [ ] **Nuevo:** `ActivityItem.vue:10` declara `type?: 'default' | 'milestone' | 'payment'`, pero `PedidoActivity.type` (`PedidoService.ts:38`) solo produce `'default' | 'milestone'` — `'payment'` es una variante muerta, quitarla
- [ ] **Cuidado — dos correcciones de este mismo documento causan regresión si se aplican literal:**
  - `ActivityItem.vue:18` usa `dateStyle`+`timeStyle: 'short'` (muestra hora); `utils/formatDate` no incluye hora. Reemplazar tal cual le quita la hora a "Pedidos recientes" — **agregar un `formatDateTime` a `utils/` en vez de reusar `formatDate`**
  - `StatCard.vue:19` formatea dinero, conteos y porcentajes con el mismo `toLocaleString()` (`unit: ''` para los que no son dinero); pasar todo a `formatCurrency` pondría "$12" en "Pedidos totales" — **condicionar por `unit` en vez de reemplazar directo**

---

## 8. Código — PiniaConfig.ts y siembra de datos 🟡

**Evidencia de tutorial-7-b: el bloque de persistencia LocalStorage de `PiniaConfig` queda comentado, no borrado, al conectar el backend real.** No invertir en refactor profundo.

- [ ] **`DemoDataService.ts`: eliminar el archivo completo — mismo motivo que `StorageService` (trabajo de storage, no de negocio) + los seeders de LocalStorage desaparecen con el backend de todas formas.**
  - [ ] Mover `generar()`/`persistir()` directo a `PiniaConfig.ts`
  - [ ] **Corregido — el `AuthService.logout()` sí tenía un motivo real, no se quita sin más:** `DemoDataService.ts:51-56` documenta por qué estaba ahí — sembrar de nuevo genera ids nuevos, así que la sesión anterior queda apuntando a un usuario que ya no existe. Además `UsuariosView.vue:101-107` le promete al usuario que la sesión se cierra. **La corrección correcta no es borrar la llamada, es que la propia vista llame `AuthService.logout()` directamente** después de restablecer los datos — una vista SÍ puede llamar a un service, eso no rompe ninguna regla
  - [ ] Actualizar regla 20 del wiki y `docs/wiki/entregable.md:66`
- [ ] Quitar la referencia a `services/seed.js` en `:19` (parte de la sección 9)
- [ ] No simplificar `hydrate<T>`/`persist<T>` — tener listas las dos respuestas de sustentación (genéricos con 4 llamadas, por qué `storeToRefs`)
- [ ] **Corregido — moví esto de "Validaciones, no tocar" a acción real:** "Seeders son funciones, no arreglos" (comentario de rúbrica) **es una corrección, no algo ya confirmado como bueno**. Tener lista la misma justificación que para `generateId()`: UUIDs generados en el momento de la siembra + referencias cruzadas entre entidades, que un arreglo literal no puede resolver sin hardcodear ids falsos
- [ ] **DECISIÓN, sin acción todavía:** "su propio storage que parece repetido" de la rúbrica no está resuelto solo con mover `StorageService`. Hoy conviven **tres** mecanismos de persistencia: los `watch` por colección de `PiniaConfig`, la persistencia manual de sesión en `AuthService`, y el diseño de 5 claves/7 métodos de `StorageService` (contra la clave única del tutorial). Decidir: ¿se colapsa a un solo mecanismo, o se prepara la defensa de por qué están separados?
- [ ] Tener lista la justificación de `generateId()` — probable vida corta con backend real

---

## 9. Código — Referencias muertas 🟢

**Conteo corregido: 12 archivos, 16 líneas** (no "12 ocurrencias en 9 archivos" como decía v4).
- [ ] `PiniaConfig.ts:19`, `UserSeeder.ts:7`, `CreadorSeeder.ts:7`, `MarcaSeeder.ts:7`, `PedidoSeeder.ts:23,45,47`, `AuthService.ts:9-10`, `PedidoService.ts:91,124`, `accessControl.ts:16`, `NavBar.vue:31`, `LoginDTO.ts:6`, `PedidosPorEstadoDTO.ts:7`, `UserService.ts:34`

---

## 10. Código — CRUDs 🟢

- [ ] Estandarizar Usuarios vs. Pedidos/Creadores
- [ ] **Nuevo criterio obligatorio: el entregable exige entre 7 y 14 páginas.** Hoy hay 10, dentro del rango — verificar que la estandarización de Usuarios no lo saque del rango:

| Opción | Páginas resultantes |
|---|---|
| Todo a 3 páginas (Usuarios +2) | 12 ✅ |
| Todo inline (Pedidos −2, Creadores −2) | 6 ❌ — por debajo del mínimo de 7 |

  Verificar el conteo final antes de ejecutar, no después.

---

## Fuera de esta corrección — para consultar de cara al próximo entregable

- **Marca sin CRUD:** la rúbrica marcó "2 CRUDs" como cumplido — Marca sin interfaz de usuario no es un error que el profesor haya señalado, es algo que salió en la auditoría del código. No es una corrección de Entregable 1, es una decisión de alcance para consultar cuando se sepa qué pide el próximo entregable (backend).

---

## 11. Código — Librerías JS

- [ ] Pregunta para el profesor: ¿`vue-toastification` cuenta como segunda librería?
- [ ] Si no cuenta: instalar una de visualización de datos

---

## 12. Transversal — Idioma 🟢 — al final, con smoke test

**Confirmado: se traducen también los nombres de entidad** (`Pedido`→`Order`, `Marca`→`Brand`, `Creador`→`Creator`). Con solo los campos ya contados: 164/323 identificadores, 176/326 líneas de comentario, 582 ocurrencias de campos. Con las entidades, se suman renames de archivo/carpeta/ruta en las 4 categorías por entidad (interfaces, services, stores, seeders) más vistas, componentes, DTOs y rutas — **no cuantificado con precisión todavía**, porque enumerar cada archivo desde esta conversación (que ha visto el código moverse de versión en versión) arriesga errores u omisiones. Recomendación: antes de ejecutar esta sección, correr una tercera pasada de Claude Code que solo haga el inventario exacto (`find src -type f`, `grep -rl` por entidad) contra el estado real del repo en ese momento, no reconstruirlo de memoria.

**Alcance ampliado, no cubierto en v4:**
- [ ] Texto de UI: etiquetas, toasts, textos de `confirm()`, mensajes de `validate()` que se muestran en toasts
- [ ] Rutas: `name: '...'` son strings sin tipar — `type-check` no detecta si alguna queda a medio traducir
- [ ] Claves y campos de LocalStorage — mismo problema que el rename de `coordinadorId` (sección 4): versionar las claves para no romper datos ya persistidos, ahora para más colecciones (`creatorly_pedidos`→algo como `creatorly_orders_v2`, etc.)
- [ ] Capturas del wiki (`docs/wiki/assets/*.png`) quedan desactualizadas si cambia la UI
- [ ] `locale: 'es-CO'` en los formateadores — probablemente se mantiene, es formato de moneda para el mercado colombiano, no un identificador de código

---

## 13. Código — Duplicación 🟢

- [ ] `ESTADOS` duplicado 4 veces. **Corregido — el enfoque anterior era técnicamente imposible en TypeScript** (no se puede derivar un arreglo desde un `type`). El patrón correcto es al revés:
  ```ts
  export const ESTADOS = ['solicitado', 'asignado', 'en_produccion', 'entregado', 'aprobado'] as const
  export type EstadoPedido = typeof ESTADOS[number]
  ```
  Ambos exportados juntos desde `PedidoInterface.ts` (no desde un service — así ni el seeder ni las vistas necesitan importar una clase de service para una constante)
- [ ] `ROLES` duplicado: `UserService.ts:10`, `UsuarioForm.vue:27`
- [ ] `EMAIL_REGEX` duplicado: `UserService.ts:12`, `MarcaService.ts:9`
- [ ] `ESTADOS_FINALES` duplicado: `PedidoService.ts:25`, `PedidoSeeder.ts:10`
- [ ] **Nuevo:** unión de tipo de actividad duplicada entre `PedidoService.ts:38` y `ActivityItem.vue:10` (ver sección 7, incluye una variante muerta)
- [ ] **Nuevo:** normalización de email (`.trim().toLowerCase()`) repetida en 3 archivos: `UserService.ts:40-42,52,80`, `MarcaService.ts:38,66`, `UsuarioForm.vue:41`
- [ ] **Nuevo:** cálculo de "hoy" (`new Date().toISOString().slice(0,10)`) duplicado en `PedidoService.ts:143` y `PedidoForm.vue:39` — ver también el bug de zona horaria abajo
- [ ] **Nuevo:** qué rutas son solo-admin está duplicado entre `NavBar.vue:21-27` (`admin: true`) y `adminRoutes.ts` (`meta.admin`)
- [ ] **Nuevo:** textos de `confirm()` duplicados entre tabla y vista de edición, en Creadores y en Pedidos
- [ ] **Nuevo (ligado a la regla "no colores mágicos" de la sección 2):** `#ffffff` hardcodeado 13 veces en 12 SFCs, más `rgba()` y atributos SVG en `NavBar.vue`, existiendo ya `--brand-white` en `base.css` — reemplazar por la variable

---

## 14. Código — Detalle menor 🟢

- [ ] Reordenar imports en `AuthService.ts:16-20` y `PedidoService.ts:10-19`
- [ ] **Nuevo:** no hay ninguna regla de lint que verifique el orden de imports (ni `sort-imports` ni `import/order`) — después de mover `StorageService` (nueva carpeta `src/storage/`), agregar imports de seeders a `PiniaConfig.ts`, y mover tipos a `interfaces/`, hay que revisar el orden a mano en esos archivos específicamente, no solo los 2 ya conocidos
- [ ] Regenerar y commitear `dist/` después de cada corrección de código

---

## Bugs funcionales encontrados (independientes de la rúbrica)

No estaban en ningún comentario de calificación, pero son errores reales que probablemente aparezcan en el smoke test — mejor saberlos ahora.

- [ ] **`PedidoService.update()` (`:165,168`) usa `??` para combinar cambios.** El formulario manda `null` explícito para quitar el creador asignado o borrar la fecha de entrega, y `null ?? valorAnterior` conserva el valor viejo — **hoy no se puede des-asignar un creador ni borrar una fecha de entrega desde la UI**, y ningún test cubre `update()`. Corregir la lógica de merge para distinguir "no cambió" de "se puso en null a propósito"
- [ ] **Bug de zona horaria en el cálculo de "hoy"** (ver sección 13) — después de las 7pm hora Bogotá, `new Date().toISOString().slice(0,10)` da la fecha de mañana. `docs/findings-timezone.md` ya lo documenta pero lo pospuso por el periodo de calificación — esa razón ya no aplica porque `dist/` se regenera de todas formas

---

## Datos ya persistidos y despliegue en GCP

**Nuevo — no estaba considerado en ninguna versión anterior.** El sitio ya desplegado en GCP puede tener datos sembrados con la forma vieja (`coordinadorId` en vez de `userId`, entre otros). Después de los renames:
- [ ] Versionar las claves de LocalStorage afectadas (ej. `creatorly_pedidos` → `creatorly_pedidos_v2`) para que los navegadores con datos viejos simplemente vuelvan a sembrar, en vez de cargar datos con campos `undefined`
- [ ] Confirmar que el Dockerfile (`:3`, copia `dist/`) efectivamente sirve la versión nueva después del redeploy

---

## Fuera de alcance — rama `ci/github-actions-vitest`

Es de otra materia (Pruebas de Software), no de Ingeniería de Software Web. Se deja aislada, sin mergear, sin tocar, y sin coordinar con esta corrección.

---

## Orden sugerido de ejecución

1. Reemplazar el archivo en disco por esta versión
2. Resolver la decisión que queda: `vue-toastification`
3. Documentación (wiki + `AGENTS.md` + `CLAUDE.local.md` + ADRs)
4. **Mover `StorageService` y eliminar `DemoDataService` en el mismo commit** (no por separado — rompe `type-check` si no)
5. Resto de correcciones 🟢 de código estructural (secciones 4, 6, 7, 9, 10, 13, 14), incluyendo los bugs funcionales
6. Limpieza 🟡 mínima (sección 8)
7. Diagramas — dibujados contra la estructura ya corregida
8. Idioma — al final, con smoke test, incluyendo un inventario fresco de archivos a renombrar y el versionado de claves de LocalStorage

**Entregable 1 se da por corregido y cerrado aquí.** Backend (tutoriales 6-7) empieza después, como fase aparte.

---

## Preguntas abiertas para el profesor

1. "Servidor no se comunica con servidor" — lectura razonable, sin confirmar
2. Alcance exacto de "estandarizar CRUD"
3. ¿`vue-toastification` cuenta como segunda librería JS?
4. `coordinadorId` → `userId` como pide la rúbrica colisiona semánticamente con el `userId` de sesión que ya existe en el código — vale la pena mencionarlo, aunque el nombre venga dado

*(Marca sin CRUD no entra aquí — ver "Fuera de esta corrección", es una consulta para el próximo entregable, no algo urgente de esta entrega)*

---

## Validaciones — confirmado que están bien, no tocar

- Interfaces sin métodos, declaradas con `interface`
- No existe la carpeta `composables/`
- Las 10 vistas y 17 componentes no importan stores directamente (salvo las 3 excepciones documentadas)
- Import alphabetization: correcta salvo los archivos ya en corrección (sección 14)
- Modelos de dominio como `interfaces/` sin métodos, lógica en `services/`
- **Ya no incluye "seeders función pura" ni "seeders un archivo por entidad" sin matiz** — lo segundo sigue siendo cierto (estructura correcta), pero "función pura" es técnicamente falso (usan `generateId()`, que es aleatorio) y "son funciones, no arreglos" es una desviación a defender, no algo confirmado como bueno — ver secciones 2 y 8
