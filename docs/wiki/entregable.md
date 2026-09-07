# Entregable 1 Parte 1

> 📌 **Nota para el equipo:** las imágenes referenciadas (`assets/…`) están en `docs/wiki/assets/` del repo. Al publicar este wiki en GitHub, subirlas con la interfaz del wiki (arrastrar la imagen al editor) y ajustar las rutas.

## 1. Logo del equipo

El logotipo de **Creatorly** utiliza el concepto *Monogram + Meaning* combinado con *Negative Space*:
- **Concepto:** Representa un monograma de la **C** de Creatorly cuyos dos extremos simbolizan a las dos partes involucradas (**Marca** arriba y **Creador** abajo). En el espacio negativo de apertura se ubica un **rombo (nodo a 45°)** que representa el **Pedido** como el conector indispensable gestionado por la agencia.
- **Tipografía Wordmark:** `Unbounded 600`.
- **Colores:** Trazo en `--color-primary` (`#7c3aed`) y nodo central en blanco (`#ffffff`).
- **Especificación técnica y SVG:** Ver detalle completo en [Identidad de Marca y Sistema de Diseño](identidad-de-marca).

![Logo Creatorly](assets/logo-creatorly.png)

## 2. Modelo verbal definitivo

**¿Qué es?** Creatorly es una herramienta interna (dashboard tipo SPA) para que una agencia de contenido UGC (User Generated Content) administre su operación diaria: su catálogo de creadores, las marcas que le solicitan contenido, y los pedidos que conectan a ambos — desde que la marca hace la solicitud hasta que el creador entrega el contenido.

**Problema que resuelve.** La agencia funciona como intermediario entre las marcas que necesitan contenido y los creadores que lo producen. Sin una herramienta central, esa coordinación (qué marca pidió qué, a qué creador se asignó, en qué estado va, cuánto se pactó) vive dispersa en chats de WhatsApp, hojas de cálculo y notas sueltas. El dashboard centraliza toda esa operación en un solo lugar.

**Alcance (versión inicial).** El sistema se enfoca en la operación interna de la agencia: gestión del catálogo de creadores, gestión de las marcas/clientes, y el ciclo de vida de los pedidos de contenido (solicitud → asignación → producción → entrega), con su presupuesto y su seguimiento de estado. Los datos se simulan en LocalStorage del navegador. Extensión futura prevista: medición del rendimiento del contenido publicado (vistas, engagement), a evaluar con el profesor.

**Actores involucrados.**
- *Administrador de la agencia:* acceso total; gestiona creadores, marcas y usuarios internos. Es quien accede a las páginas restringidas (solo-admin).
- *Coordinador de contenido (usuario estándar):* gestiona los pedidos que tiene a cargo y consulta los reportes del sistema.

**Beneficio de la propuesta.** Un solo lugar donde la agencia puede ver todos sus pedidos filtrables por marca, creador o estado, con tablas y gráficos (Chart.js) que muestran cuántos pedidos hay por estado o por mes y cuánto presupuesto se ha comprometido. Esto apoya decisiones concretas como a qué creador asignar el próximo pedido o qué marca es la más activa.

## 3. Diagrama de clases

![Diagrama de clases](./assets/diagrama-clases.png)

El sistema se modela con exactamente **4 clases**. **Pedido** es la clase central del dominio: relaciona a la **Marca** que solicita el contenido, al **Creador** al que se asigna, y al **User** (coordinador) que lo gestiona internamente.

| Clase | Atributos |
|---|---|
| **User** | id, nombre, email, password, rol (`admin` \| `coordinador`), createdAt, updatedAt |
| **Creador** | id, nombre, nicho, tipoContenido, tarifa, disponible, createdAt, updatedAt |
| **Marca** | id, nombre, industria, contactoNombre, contactoEmail, createdAt, updatedAt |
| **Pedido** | id, descripcion, presupuesto, fechaSolicitud, fechaEntrega, estado, createdAt, updatedAt, marca, creador, coordinador |

**Relaciones y cardinalidades:**
- Un User (coordinador) gestiona muchos Pedido → 1 a 0..*
- Un Creador es asignado a muchos Pedido → 1 a 0..*
- Una Marca solicita muchos Pedido → 1 a 0..*
- Se usa 0..* (y no 1..*) porque un creador o una marca recién registrados pueden existir sin pedidos asociados aún.

## 4. Diagrama de arquitectura

Mapa de módulos: cada caja es una carpeta real de `src/`, cada fila dentro es un archivo real. Las flechas dicen "usa/importa" (A → B significa que A importa algo de B), verificado import por import contra el código.

![Diagrama de arquitectura completo](assets/diagrama-arq-completo.png)

Detalle por partes (el diagrama completo es muy grande para leerse de corrido):

![Arquitectura parte 1: entrada, router, main.ts, PiniaConfig](assets/diagrama-arq-pt1.png)

![Arquitectura parte 2: vistas, componentes, charts](assets/diagrama-arq-pt2.png)

![Arquitectura parte 3: services, utils, dtos, seeders, stores](assets/diagrama-arq-pt3.png)

![Arquitectura parte 4: dtos, interfaces, seeders, stores, LocalStorage](assets/diagrama-arq-pt4.png)

[Link del diagrama](https://lucid.app/lucidchart/9f425ba0-8f21-44b7-b40a-330e12673750/edit?viewport_loc=-12152%2C4670%2C4484%2C1947%2Cp1&invitationId=inv_f07ff397-f817-46c1-89ba-60e26ed17a5c)

Capas (de afuera hacia adentro): `main.ts` arranca Pinia (`PiniaConfig.ts`) y el `router` → **vistas** (`views/`, una por ruta) → **componentes reutilizables** (`components/`, con los gráficos Chart.js aislados en `components/charts/`) → **services** (toda la lógica, tipada con `interfaces/` y `dtos/`) → **stores de Pinia** (solo el array de cada entidad) → **StorageService** (única puerta a LocalStorage) → **LocalStorage** (persistencia simulada). Dos excepciones documentadas: el guard del router (`accessControl.ts`) lee `SessionStore` directamente en vez de pasar por un service, y `DemoDataService.reset()` (botón de "restablecer datos demo") escribe a la vez en `StorageService` y directamente en los 4 stores, para no depender del timing del watcher que normalmente persiste los cambios. El servidor solo entrega estáticos; toda la ejecución ocurre en el navegador del cliente.

## Anexo: capturas de las páginas

> Los sketches originales de la Fase 0 quedaron desactualizados frente a la app real ya implementada.

| # | Página | Captura |
|---|---|---|
| 1 | Home | ![Home admin](assets/home-admin.png)<br>![Home coordinador](assets/home-coord.png) |
| 2 | Login | ![Login](assets/login-version1.png) |
| 3 | Pedidos (CRUD #2 + selector/tabla/Chart.js) | ![Pedidos filtrado por estado](assets/pedidos-sketch1.png)<br>![Pedidos filtrado por marca](assets/pedidos-sketch2.png) |
| 4 | Crear / Editar Pedido | ![Crear pedido](assets/crear-pedido.png)<br>![Editar pedido](assets/editar-pedido.png) |
| 5 | Creadores (solo-admin, CRUD #1) | ![Creadores](assets/creadores-admin.png) |
| 6 | Reportes (selector/tabla/Chart.js) | ![Reportes: pedidos por mes](assets/reportes-chart1.png)<br>![Reportes: pedidos por estado](assets/reportes-chart2.png)<br>![Reportes: pedidos por creador](assets/reportes-chart3.png)<br>![Reportes: presupuesto por marca](assets/reportes-chart4.png) |
| 7 | Usuarios (solo-admin) | ![Usuarios](assets/usuarios-admin.png) |
