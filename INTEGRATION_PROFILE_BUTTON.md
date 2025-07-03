# 🔗 Guide d'Intégration : Bouton Profil LinkESTIAM

## 📋 Vue d'ensemble

Ce guide explique comment intégrer le bouton d'accès au profil dans l'interface principale de partage/stockage de fichiers.

## 📦 Composant Disponible

Le composant `ProfileButton` se trouve dans : `/components/ProfileButton.tsx`

## 🎨 Variantes Disponibles

### 1. **Default** - Comme dans le design
```tsx
<ProfileButton 
  variant="default" 
  userName="Mon profil"
/>
```
**Usage** : Menus latéraux, pages de paramètres, dashboards

### 2. **Compact** - Pour les headers/navbars
```tsx
<ProfileButton 
  variant="compact" 
  showText={true}
/>
```
**Usage** : Barres de navigation, headers compacts

### 3. **Icon-only** - Icône seule
```tsx
<ProfileButton 
  variant="icon-only"
/>
```
**Usage** : Coins d'écran, interfaces minimales, mobiles

## 🚀 Exemples d'Intégration

### Dans un Header/Navbar
```tsx
import ProfileButton from '@/components/ProfileButton'

function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-900">
      <h1>LinkESTIAM - Partage de Fichiers</h1>
      <ProfileButton variant="compact" />
    </header>
  )
}
```

### Dans une Sidebar
```tsx
function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 p-4">
      <nav className="space-y-4">
        <a href="/files">Mes Fichiers</a>
        <a href="/shared">Partagés</a>
        {/* Bouton profil en bas */}
        <div className="mt-auto pt-8">
          <ProfileButton variant="default" userName="Mon profil" />
        </div>
      </nav>
    </aside>
  )
}
```

### En Position Fixe (coin d'écran)
```tsx
function Layout({ children }) {
  return (
    <div className="relative min-h-screen">
      {children}
      
      {/* Bouton profil fixe en haut à droite */}
      <div className="fixed top-4 right-4 z-50">
        <ProfileButton variant="icon-only" />
      </div>
    </div>
  )
}
```

### Dans un Dashboard
```tsx
function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Contenu principal */}
        <main className="flex-1 p-6">
          <h1>Mes Fichiers</h1>
          {/* ... contenu ... */}
        </main>
        
        {/* Panel utilisateur */}
        <aside className="w-80 bg-white p-6 shadow-lg">
          <ProfileButton variant="default" />
          {/* Autres infos utilisateur */}
        </aside>
      </div>
    </div>
  )
}
```

## ⚙️ Props Disponibles

| Prop | Type | Défaut | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'compact' \| 'icon-only'` | `'default'` | Style du bouton |
| `userName` | `string` | `'Mon profil'` | Texte affiché |
| `showText` | `boolean` | `true` | Afficher le texte |
| `className` | `string` | `''` | Classes CSS additionnelles |

## 🎯 Recommandations par Section

### 🔝 **Header/Navbar**
```tsx
<ProfileButton variant="compact" showText={false} />
```

### 📱 **Mobile**
```tsx
<ProfileButton variant="icon-only" />
```

### 🖥️ **Desktop Sidebar**
```tsx
<ProfileButton variant="default" userName={user.name} />
```

### 📊 **Dashboard Cards**
```tsx
<ProfileButton variant="compact" className="w-full justify-start" />
```

## 🎨 Personnalisation

### Modifier les couleurs
```css
/* Dans votre CSS global */
.profile-button-default {
  /* Personnaliser selon votre theme */
  background: rgba(votre-couleur, 0.8);
  border-color: rgba(votre-couleur-accent, 0.3);
}
```

### Adapter la taille
```tsx
<ProfileButton 
  variant="compact"
  className="scale-90" // Plus petit
/>

<ProfileButton 
  variant="default"
  className="scale-110" // Plus grand
/>
```

## 🔄 État Utilisateur Dynamique

```tsx
import { useUser } from '@/hooks/useUser' // Votre hook

function MyComponent() {
  const { user } = useUser()
  
  return (
    <ProfileButton 
      userName={user ? `${user.firstName} ${user.lastName}` : 'Mon profil'}
      variant="default"
    />
  )
}
```

## 📱 Responsive

Le composant s'adapte automatiquement :
- **Desktop** : Toutes les variantes disponibles
- **Tablet** : Préférer `compact` ou `icon-only`
- **Mobile** : Recommandé `icon-only`

```tsx
// Exemple responsive
<div className="hidden md:block">
  <ProfileButton variant="default" />
</div>
<div className="md:hidden">
  <ProfileButton variant="icon-only" />
</div>
```

## ✅ Checklist d'Intégration

- [ ] Importer le composant : `import ProfileButton from '@/components/ProfileButton'`
- [ ] Choisir la variante selon l'emplacement
- [ ] Tester sur mobile/desktop
- [ ] Vérifier l'accessibilité (title sur icon-only)
- [ ] Adapter les couleurs si nécessaire

---

**🔗 Le composant gère automatiquement la navigation vers `/profile`**  
**🎨 Couleurs alignées avec la charte LinkESTIAM**  
**📱 Responsive et accessible** 