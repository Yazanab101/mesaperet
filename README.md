# מיטל גוטמן שקד — מספרת נומרולוגיה

Pixel-faithful rebuild of [me-saperet.com](https://www.me-saperet.com/) (authorized migration).

## Stack

- React + TypeScript + Vite
- React Router (RTL Hebrew routes)
- Framer Motion (home entrance)
- Local authorized assets in `public/assets`

## Develop

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

## Contact form integration

Wire your backend in `src/services/contact.ts` (`submitContactForm`).

## Audits

- `SITE_RECONSTRUCTION_AUDIT.md`
- `ASSET_INVENTORY.md`
- `INTERACTION_AUDIT.md`
