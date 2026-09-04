# Creatorly

Lenguaje ubicuo del dashboard interno de una agencia de creadores UGC. Este documento es únicamente el glosario del dominio; las decisiones de implementación viven en `docs/adr/`.

## El negocio

**Agencia**:
La organización dueña de Creatorly; intermediaria entre las marcas que necesitan contenido y los creadores que lo producen.
_Evitar_: la empresa, nosotros.

**UGC**:
Contenido generado por usuarios (User Generated Content): el tipo de contenido que producen los creadores para las marcas.
_Evitar_: publicidad, marketing de contenidos.

**Creador**:
El talento UGC del catálogo de la agencia; quien produce el contenido de los pedidos que se le asignan.
_Evitar_: influencer, talento, perfil.

**Marca**:
El cliente de la agencia; quien solicita el contenido en cuyo nombre se crea cada pedido.
_Evitar_: cliente, empresa, account.

**Pedido**:
La unidad de trabajo del sistema: una solicitud de contenido de una marca, asignada a un creador y gestionada por un coordinador, con presupuesto y estado.
_Evitar_: orden, trabajo, solicitud, proyecto.

## Roles

**User**:
Usuario interno del sistema, con credenciales para iniciar sesión.
_Evitar_: cuenta, perfil.

**Administrador**:
El rol con acceso total: gestiona creadores, marcas y users, y es el único que entra a las páginas restringidas.
_Evitar_: superusuario.

**Coordinador**:
El rol estándar: gestiona los pedidos a su cargo y consulta los reportes.
_Evitar_: usuario estándar, operativo.

## Ciclo de vida

**Estado del Pedido**:
Una y solo una de estas cinco etapas: `solicitado`, `asignado`, `en_produccion`, `entregado`, `aprobado`.
_Evitar_: status, fase, paso.

**Siembra**:
Los datos ficticios iniciales que pueblan el sistema en el primer arranque, antes de que exista cualquier dato real.
_Evitar_: mock, fixture, datos de prueba.

**Sesión**:
El estado de un User autenticado mientras usa el sistema.
_Evitar_: login (ese es el acto de entrar, no el estado).
