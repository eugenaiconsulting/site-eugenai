# FiveZoneShowcase - Composant de galerie interactive

Un composant React moderne qui affiche 5 images avec une interaction basée sur des zones de souris.

## 🎯 Fonctionnalités

### Interaction par zones (Desktop)
- **5 zones égales** : L'écran est divisé en 5 colonnes égales (zones 0→4)
- **Sélection instantanée** : L'image active correspond à la zone sous la souris
- **Snapping immédiat** : Changement d'image fluide et instantané
- **Zone centrale par défaut** : Commence avec la 3ème image active (zone 2)

### Interaction tactile (Mobile)
- **Swipe horizontal** : Glissement pour changer d'image
- **Snapping au relâchement** : L'image la plus proche devient active
- **Seuil de déclenchement** : 50px minimum pour changer d'image

### Navigation clavier
- **Flèches gauche/droite** : Navigation entre les images
- **Accessibilité** : Support des lecteurs d'écran avec `role="tablist"`

## 🎨 Style et animations

### Images actives vs inactives
- **Active** : `opacity: 1`, `scale: 1.05`, `z-index: 10`, ombre douce
- **Inactive** : `opacity: 0.45`, `scale: 1`, `z-index: 0`
- **Transitions** : 300ms ease-out pour toutes les propriétés

### Design
- **Coins arrondis** : `rounded-3xl` pour un look moderne
- **Masque latéral** : Fade doux sur les bords (6% de chaque côté)
- **Responsive** : Hauteurs adaptatives (440px tablet, 520px desktop)

## 📦 Utilisation

```tsx
import FiveZoneShowcase, { Img } from '@/components/FiveZoneShowcase';

const images: Img[] = [
  { id: '1', src: '/image1.jpg', alt: 'Description 1' },
  { id: '2', src: '/image2.jpg', alt: 'Description 2' },
  { id: '3', src: '/image3.jpg', alt: 'Description 3' },
  { id: '4', src: '/image4.jpg', alt: 'Description 4' },
  { id: '5', src: '/image5.jpg', alt: 'Description 5' },
];

<FiveZoneShowcase
  images={images}
  height={520}
  gap={20}
  activeScale={1.05}
  inactiveOpacity={0.45}
  className="md:h-[440px] lg:h-[520px]"
/>
```

## ⚙️ Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `images` | `Img[]` | **requis** | Tableau d'au moins 5 images |
| `height` | `number` | `520` | Hauteur des images en pixels |
| `gap` | `number` | `20` | Espacement entre les images |
| `activeScale` | `number` | `1.05` | Facteur d'échelle pour l'image active |
| `inactiveOpacity` | `number` | `0.45` | Opacité des images inactives |
| `className` | `string` | `''` | Classes CSS supplémentaires |

## 🎮 Logique des zones

### Calcul de la zone
```typescript
const zones = 5;
const x = (mouseX - containerLeft) / containerWidth; // 0..1
const zoneIndex = clamp(Math.floor(x * zones), 0, zones - 1);
```

### Mapping des zones
- **Zone 0** (gauche) → Image 1 (index 0)
- **Zone 1** → Image 2 (index 1)  
- **Zone 2** (centre) → Image 3 (index 2) - **par défaut**
- **Zone 3** → Image 4 (index 3)
- **Zone 4** (droite) → Image 5 (index 4)

## 🚀 Performance

### Optimisations
- **Transforms GPU** : Utilise `transform` et `opacity` uniquement
- **Pas de reflow** : Aucun changement de layout
- **Preload intelligent** : `loading="eager"` pour les 5 images visibles
- **Priorité** : Les 3 premières images ont `priority={true}`

### Responsive
- **Mobile** : Détection automatique via `window.innerWidth < 768`
- **Touch** : Support natif des événements tactiles
- **Breakpoints** : Hauteurs adaptatives selon la taille d'écran

## 🎯 Critères d'acceptation

✅ **Zones fonctionnelles** : Zone centrale active toujours la 3ème image  
✅ **Snapping instantané** : Changement d'image fluide sans jank  
✅ **Images plus grandes** : Hauteur 520px desktop, 440px tablet  
✅ **Opacité contrastée** : Active 100%, inactive 45%  
✅ **Mobile responsive** : Swipe avec snapping au relâchement  
✅ **Accessibilité** : Navigation clavier et support lecteurs d'écran  
✅ **Performance** : 60fps, pas de reflow, optimisations GPU  

## 🔧 Développement

### Structure du composant
```
FiveZoneShowcase/
├── État local (activeIndex, isMouseOver, etc.)
├── Gestionnaires d'événements (souris, touch, clavier)
├── Calcul des zones (calculateZone)
├── Rendu des 5 images avec transitions
└── Masque latéral et indicateurs debug
```

### Événements gérés
- `mousemove` : Calcul de la zone et mise à jour activeIndex
- `mouseenter/leave` : Activation/désactivation de l'interaction
- `touchstart/move/end` : Gestion du swipe mobile
- `keydown` : Navigation clavier (flèches)

Le composant est prêt à l'emploi et respecte toutes les spécifications demandées !
