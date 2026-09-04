# ADR-0004: Migración a TypeScript y patrón interfaces + stores + services

- **Fecha:** 2026-09-02
- **Estado:** Aceptada
- **Decide:** Kevin Pabón (arquitecto)

## Contexto

Creatorly se construyó en JavaScript con una arquitectura de clases-modelo: cada entidad (`User`, `Creador`, `Marca`, `Pedido`) era una clase que cargaba a la vez su forma, sus validaciones y su CRUD estático, leyendo y escribiendo directamente contra `services/storage.js`. El tipado se documentaba con JSDoc.

Esa decisión se tomó leyendo el enunciado "Entregable 1 Parte 1 - Base", que no menciona TypeScript, ni DTOs, ni interfaces, ni una estructura de carpetas específica. Solo pide Vue 3, LocalStorage, páginas, CRUDs y Chart.js.

El 2026-09-01 otro equipo del curso sustentó su proyecto y el profesor compartió la rúbrica de calificación. La rúbrica enumera, como ítems calificables: **Store, DTOs, Interfaces, Services, Views, Components, Utils**. Durante la sustentación el profesor revisó archivo por archivo el tipado, el orden de los imports, el nombramiento de variables y la ubicación de los gráficos.

Al revisar los tutoriales del curso (`desarrollo-web-tutoriales`), se confirmó que:

- Están escritos en TypeScript con `tsconfig` y `vue-tsc`.
- Su `src/` contiene exactamente `interfaces/`, `dtos/`, `stores/`, `services/`, `utils/`, `components/` y `views/`.
- El patrón es: interface con solo atributos, store de Pinia que solo guarda el array, y service como clase de métodos estáticos con toda la lógica.
- Los CRUD se dividen en tres rutas (`BooksIndexView`, `BooksCreateView`, `BooksShowView`).

El proyecto del equipo que sustentó sigue ese mismo patrón sin desviarse, y obtuvo buena calificación.

La conclusión es que la arquitectura evaluada no viene del enunciado escrito sino de la "dictadura de código" acordada en clase, materializada en los tutoriales.

## Decisión

Migrar Creatorly a TypeScript y adoptar el patrón de tres capas de los tutoriales:

- **`interfaces/`** — la forma de cada entidad, solo atributos, sin métodos.
- **`dtos/`** — tipos derivados con `Omit`/`Pick`, uno por caso de uso.
- **`stores/`** — Pinia, únicamente el array de la entidad, sin lógica.
- **`services/`** — clases de métodos estáticos con toda la lógica de negocio y las validaciones.
- **`seeders/`** — datos de siembra, uno por entidad.
- **`utils/`** — formateadores y helpers.
- **`components/charts/`** — todos los gráficos Chart.js; ninguna view los importa.

Se elimina la carpeta `composables/`: su lógica pasa a los services.

El plan de ejecución en 7 pasos vive en `PLAN_MIGRACION_TS.md`.

## Alternativas consideradas

**Quedarse en JavaScript con JSDoc.** El JSDoc actual es correcto y da autocompletado en el editor, y el enunciado escrito no exige TypeScript. Se descartó porque la rúbrica califica explícitamente DTOs e interfaces, que son construcciones de TypeScript, y porque el profesor revisó el tipado en detalle durante la sustentación. El riesgo de perder esos ítems supera el costo de migrar.

**Migrar solo la estructura de carpetas, sin TypeScript.** Se podrían crear `services/` y `utils/` en JS. Se descartó porque `interfaces/` y `dtos/` no tienen equivalente real en JavaScript: un DTO en el patrón del curso es un tipo derivado (`Omit<UserInterface, 'id'>`), y eso no existe sin TS.

**Migrar después de terminar las páginas.** Se descartó por lo contrario: migrar más tarde es mucho más caro. Hoy ninguna vista está implementada, así que el trabajo a rehacer es cero.

## Consecuencias

**Positivas**

- La estructura del proyecto coincide con los ítems 8 a 14 de la rúbrica.
- Los tipos se verifican en tiempo de compilación (`vue-tsc` en el build), no solo en el editor.
- La separación store/service hace las views delgadas y la lógica testeable y reutilizable.
- El equipo trabaja sobre el mismo patrón que ya practicó en los tutoriales, en vez de uno propio.

**Negativas**

- Costo inmediato de migración de la base (modelos, storage, siembra, router, sesión).
- Felipe y Gerónimo quedan bloqueados hasta que termine el paso 6 del plan.
- Ambos compañeros deben trabajar en TypeScript, que puede ser nuevo para ellos. Se mitiga con una guía corta del patrón, que además alimenta la página "Reglas de programación" del wiki.
- Cada entidad pasa de un archivo a tres, lo que aumenta el número de archivos aunque baje el acoplamiento.

**Sobre el diagrama de clases**

El diagrama entregado declara `+CRUD()`, `+getters()`, `+setters()` en las cuatro clases. Con interfaces puras esos métodos ya no existen en el código. Se verificó que el equipo que sustentó tiene exactamente el mismo descuadre —diagrama con esos tres métodos, código con interfaces sin métodos— y el profesor no lo penalizó. **El diagrama no se modifica.**

Si en la sustentación se pregunta por el descuadre, la explicación es que el diagrama modela el dominio (qué operaciones existen sobre cada entidad) mientras que el código las ubica en la capa de servicios, siguiendo el patrón del curso.

## Impacto en ADRs previos

- **ADR-0001** (LocalStorage + referencias por id): sigue vigente. Cambia el nombre del archivo (`storage.js` → `StorageService.ts`) y se agrega `PiniaConfig.ts` para hidratar y persistir los stores.
- **ADR-0003** (BaseChart propio): sigue vigente y se refuerza. El componente pasa a `components/charts/` y la regla "ninguna view importa Chart.js" queda explícita en la rúbrica del profesor.
