# Contributing

Gracias por tu interés. Este proyecto vive de plantillas y mejoras de UX, así que toda PR pequeña es bienvenida.

## Setup local

```bash
git clone https://github.com/Xdewilo/CV.git
cd CV
npm install
npm run dev
```

Web en `http://localhost:4200`, API en `http://localhost:3000`.

## Workflow

1. Fork + branch desde `main`. Nombre `feat/`, `fix/` o `chore/`.
2. Cambios pequeños y enfocados. Si tu PR toca varias áreas, divídela.
3. `npm run build` debe pasar antes de PR.
4. Ejecuta el flujo end-to-end: cargar demo → cambiar plantilla y fuente → descargar PDF → verificar texto seleccionable.
5. PR con descripción clara: qué cambia, por qué, screenshots si afecta UI.

## Agregar plantilla nueva

1. Crea `packages/templates/src/<id>.ts` con la función render + `.css`.
2. Regístrala en `packages/templates/src/render.ts` (`renderBody` switch).
3. Agrega su id al array `TEMPLATE_IDS` en `packages/cv-schema/src/index.ts`.
4. Captura screenshot 800x1130 y agrégalo al README.

## Agregar fuente

- `FONT_OPTIONS` en `packages/cv-schema/src/index.ts`.
- Si es Google Font, añade su family a `GOOGLE_FAMILIES` en `packages/templates/src/fonts.ts` y al `<link>` precargado en `apps/web/src/index.html`.

## Estilo

- Prettier ya configurado en root (`npm run format`).
- TypeScript strict en todos los paquetes.
- Sin comentarios obvios — preferimos identificadores claros.
