# Site Eugenia - Page "Boards + Témoignages"

Une page Next.js qui reproduit fidèlement le design "Boards + Témoignages" avec le style Luma Dream Machine.

## Fonctionnalités

- **Section Boards** : 3 grandes cartes avec dégradés et coins arrondis (rounded-[32px])
- **Ruban d'images infini** : Défilement fluide avec système de zones et magnétisme
- **Section Témoignages** : 3 témoignages avec avatars, noms, compteurs et citations
- **Design responsive** : Optimisé pour mobile et desktop
- **Performance** : Utilise requestAnimationFrame et transforms GPU
- **Accessibilité** : Alt text, contrastes vérifiés, focus visible

## Technologies

- Next.js 14 (App Router)
- TypeScript
- React 18
- Tailwind CSS
- Images optimisées avec Next.js Image

## Installation

1. **Installer Node.js** (version 18 ou supérieure)
   - Télécharger depuis [nodejs.org](https://nodejs.org/)

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   - Aller sur [http://localhost:3000](http://localhost:3000)

## Structure du projet

```
├── app/
│   ├── globals.css          # Styles globaux et variables CSS
│   └── page.tsx            # Page principale
├── components/
│   ├── InfiniteRibbon.tsx  # Ruban d'images avec zones et magnétisme
│   ├── BoardCard.tsx       # Carte board avec dégradé et vignettes
│   └── TestimonialsRow.tsx # Ligne de témoignages
├── utils/
│   └── imageUtils.ts       # Utilitaires pour les images
└── types/
    └── index.ts            # Types TypeScript
```

## Fonctionnalités avancées

### Système de zones et magnétisme
- Division de l'écran en 5 zones verticales
- Carte active qui suit la souris dans sa zone
- Magnétisme fluide avec limites respectées
- Parallax léger pour les autres cartes

### Optimisations de performance
- Un seul requestAnimationFrame par ruban
- Recycling des éléments pour le défilement infini
- Transforms GPU (translate3d)
- Pause automatique si l'onglet n'est pas visible

### Responsive design
- Mobile : drag horizontal inertiel
- Desktop : zones et magnétisme activés
- Détection automatique du type d'appareil

## Personnalisation

### Couleurs et thème
- Variable CSS `--page-bg` pour le fond (défaut: #DADCE0)
- Dégradés personnalisables pour chaque carte
- Couleurs Tailwind CSS

### Images
- URLs Unsplash configurées dans `utils/imageUtils.ts`
- Images optimisées avec Next.js Image
- Lazy loading et décodage asynchrone

## Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Vérification du code
```

## Déploiement

Le projet est prêt pour le déploiement sur Vercel, Netlify ou tout autre hébergeur supportant Next.js.

```bash
npm run build
npm run start
```