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

## Decisiones técnicas

- **JSONPlaceholder no persiste datos.** El caché de TanStack Query actúa como fuente de verdad de la sesión. Los posts creados localmente se marcan con `local: true` y no se envían PUT/DELETE al servidor, que respondería 404 para ids inexistentes.
- **Ids propios:** la API devuelve siempre `id: 101` al crear, lo que rompería las keys de React; se genera un id único en el cliente.
- **Sin `innerHTML`:** la versión original interpolaba texto en HTML (riesgo de XSS). React escapa el contenido por defecto.
- **Capa de API separada** (`src/api`), hooks de datos (`src/hooks`) y componentes presentacionales (`src/components`), para poder testear cada parte por separado.

## Cómo correrlo

```bash
npm install
npm run dev        # desarrollo
npm test           # tests
npm run build      # build de producción en /dist
```

## Deploy

El workflow `deploy.yml` publica en GitHub Pages en cada push a `main`. Solo activá **Settings → Pages → Source: GitHub Actions** en el repo.

## Estructura

```
src/
  api/          llamadas HTTP tipadas
  components/   Composer, PostCard, PostList, Toast, Avatar
  hooks/        usePosts (queries y mutaciones), useLikes, useTheme
  lib/          tipos y helpers puros (con tests)
```
