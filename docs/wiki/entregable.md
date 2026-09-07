# Entregable 1 Parte 1

> 📌 **Nota para el equipo:** las imágenes referenciadas (`assets/…`) están en `docs/wiki/assets/` del repo. Al publicar este wiki en GitHub, subirlas con la interfaz del wiki (arrastrar la imagen al editor) y ajustar las rutas.

## 1. Logo del equipo

El logotipo de **Creatorly** utiliza el concepto *Monogram + Meaning* combinado con *Negative Space*:
- **Concepto:** Representa un monograma de la **C** de Creatorly cuyos dos extremos simbolizan a las dos partes involucradas (**Marca** arriba y **Creador** abajo). En el espacio negativo de apertura se ubica un **rombo (nodo a 45°)** que representa el **Pedido** como el conector indispensable gestionado por la agencia.
- **Tipografía Wordmark:** `Unbounded 600`.
- **Colores:** Trazo en `--color-primary` (`#7c3aed`) y nodo central en blanco (`#ffffff`).
- **Especificación técnica y SVG:** Ver detalle completo en [Identidad de Marca y Sistema de Diseño](./identidad-de-marca.md).

```xml
<svg viewBox="0 0 120 120" width="80" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M 84.6 30.7 A 42 42 0 1 1 84.6 89.3" stroke="#7c3aed" stroke-width="15" stroke-linecap="round"/>
  <rect x="76" y="51" width="24" height="24" rx="2" transform="rotate(45 88 63)" fill="#ffffff"/>
</svg>
```

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

> ⚠️ **Borrador generado como base** — el equipo puede reemplazarlo por su versión final si prefiere otro estilo.

```mermaid
flowchart TD
    subgraph Navegador["Navegador (cliente)"]
        Rtr["Router + guards<br/>accessControl.ts · admin/adminRoutes.ts"]
        V["Vistas — SFC<br/>Home · Login · Pedidos · Creadores · Reportes · Usuarios"]
        Cmp["Componentes<br/>reutilizables + components/charts (BaseChart)"]
        Utl["utils/<br/>formateadores puros: fecha, moneda, estado"]
        Svc["services/<br/>toda la lógica y validaciones"]
        Dto["dtos/<br/>tipos derivados por caso de uso (Omit/Pick)"]
        Int["interfaces/<br/>la forma de cada entidad"]
        Str["stores/ — Pinia<br/>solo el array/estado"]
        Seed["seeders/<br/>datos ficticios tipados"]
        SS["StorageService<br/>única puerta a LocalStorage"]
        LS[("LocalStorage<br/>creatorly_*")]

        Rtr --> V
        V --> Cmp
        V --> Svc
        Cmp --> Utl
        Svc --> Utl
        Svc --> Dto
        Svc --> Str
        Str --> Int
        Seed --> SS
        Svc --> SS
        SS --> Str
        SS --> LS
    end
    GCP["Servidor de estáticos (GCP)"]
    GCP -->|"HTTP: index.html + bundle JS/CSS"| Navegador
```

Capas de la SPA (de afuera hacia adentro): **enrutamiento** (router + guards) → **vistas** (páginas SFC) → **componentes reutilizables** (presentación, con los gráficos Chart.js aislados en `components/charts/`) → **services** (toda la lógica, tipada con `interfaces/` y `dtos/`) → **stores de Pinia** (solo el array de cada entidad) → **StorageService** (única puerta a LocalStorage) → **LocalStorage** (persistencia simulada). La siembra inicial (`PiniaConfig`) sigue ese mismo camino: `seeders/` → `StorageService` → stores (hidratación). El botón de "restablecer datos demo" es una excepción deliberada y documentada: `DemoDataService.reset()` escribe a la vez en `StorageService` y directamente en los 4 stores, para no depender del timing del watcher que normalmente persiste los cambios. El servidor solo entrega estáticos; toda la ejecución ocurre en el navegador del cliente.

## Anexo: sketches de las 7 páginas

| # | Página | Sketch |
|---|---|---|
| 1 | Home | ![Sketch Home](./assets/sketch-01-home.png) |
| 2 | Login | ![Sketch Login](./assets/sketch-02-login.png) |
| 3 | Pedidos (CRUD #2 + selector/tabla/Chart.js) | ![Sketch Pedidos](./assets/sketch-03-pedidos.png) |
| 4 | Crear / Editar Pedido | ![Sketch Crear/Editar Pedido](./assets/sketch-04-crear-editar-pedido.png) |
| 5 | Creadores (solo-admin, CRUD #1) | ![Sketch Creadores](./assets/sketch-05-creadores.png) |
| 6 | Reportes (selector/tabla/Chart.js) | ![Sketch Reportes](./assets/sketch-06-reportes.png) |
| 7 | Usuarios (solo-admin) | ![Sketch Usuarios](./assets/sketch-07-usuarios.png) |
