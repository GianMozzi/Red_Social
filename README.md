# 🐤 Pajarito · mini red social

## Qué hace

- Publicar, editar y borrar publicaciones (CRUD completo contra la API de JSONPlaceholder).
- Autores reales con avatar generado por iniciales.
- Búsqueda en vivo por texto o autor.
- Me gusta persistentes (localStorage).
- Modo claro y oscuro, respeta la preferencia del sistema y no parpadea al cargar.
- Estados de carga (skeletons), error con reintento y vacío.
- Confirmación antes de borrar y notificaciones de cada acción.
- Accesible: labels, foco visible, `aria-live`, `prefers-reduced-motion`.

## Stack

| Capa | Tecnología |
| --- | --- |
| UI | React 18 + TypeScript (strict) |
| Estado del servidor | TanStack Query |
| Estilos | Tailwind CSS v4 con tokens de diseño propios |
| Build | Vite |
| Tests | Vitest + Testing Library |
| CI/CD | GitHub Actions (typecheck, tests, build y deploy a Pages) |
