# Flujo de trabajo Git: todo por Pull Request, main protegida

Nada se empuja directo a `main`: todo cambio llega por rama + Pull Request revisado y aprobado por el arquitecto (Kevin), quien además tiene autoridad para revertir commits que incumplan las reglas — exigencia explícita del enunciado del curso. El PR es la barrera de calidad: lint en verde, reglas de programación cumplidas y revisión humana antes del merge.

## Consequences

- Los mensajes de commit usan formato convencional con tipo en inglés y descripción en español (`feat: agrega gráfico de pedidos por estado`).
- Los agentes de IA que asisten a un integrante pueden hacer commits locales, pero push, PR y merge requieren autorización explícita y por escrito del integrante.
