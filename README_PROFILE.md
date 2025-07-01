# 🔒 Module Profil LinkESTIAM

## 📋 Vue d'ensemble

Module de gestion de profil utilisateur pour l'application LinkESTIAM, développé avec **Next.js 15**, **TypeScript** et **Tailwind CSS**. Interface moderne, responsive et conforme à la charte graphique violette de LinkESTIAM.

## ✨ Fonctionnalités

### 🔗 Bouton d'Accès au Profil
- **Composant réutilisable** : `ProfileButton` pour l'interface principale
- **3 variantes** : Default (design complet), Compact (navbar), Icon-only (mobile)
- **Navigation automatique** : Redirection vers `/profile` au clic
- **Style LinkESTIAM** : Couleurs et design cohérents

### 👤 Gestion du Profil
- **Modification du nom** : Validation et mise à jour en temps réel
- **Modification de l'email** : Validation format email + unicité
- **Changement de mot de passe** : Champ sécurisé avec validation
- **Sauvegarde centralisée** : Bouton centré et responsive

### ⚙️ Paramètres Utilisateur
- **Notifications** : Toggle ON/OFF avec état persistant
- **Mode sombre** : Toggle pour préférences d'affichage
- **Options avancées** : Language, Sécurité, Thème (interfaces préparées)
- **Suppression de compte** : Action sécurisée avec confirmation

### 📱 Design Responsive
- **Desktop** : Interface complète avec sidebar
- **Tablet** : Layout adapté automatiquement
- **Mobile** : Sidebar horizontale, contenu empilé

## 🎨 Charte Graphique LinkESTIAM

| Élément                     | Couleur                    | Usage                        |
| --------------------------- | -------------------------- | ---------------------------- |
| **Primary Purple**          | `#8C2CFF`                  | Boutons, toggles actifs      |
| **Background sombre**       | `#1A1A22`                  | Fond global application      |
| **Sidebar**                 | `#2A1E3F`                  | Menu latéral navigation      |
| **Contenu principal**       | `#F8F7FB`                  | Fond cartes et formulaires   |
| **Champs de saisie**        | `#2A2A38`                  | Background inputs            |
| **Bordures**                | `#333333`                  | Contours champs              |
| **Texte principal**         | `#222222` / `#F0F0F5`      | Contrastes sombre/clair      |
| **Texte secondaire**        | `#6D6D85`                  | Labels et descriptions       |
| **Séparateurs**             | `#E5E5EA`                  | Lignes de séparation         |

## 🏗️ Architecture

### 📁 Structure des fichiers

```
app/
├── (auth)/
│   └── profile/
│       └── page.tsx          # Interface principale responsive
├── api/
│   ├── profile/
│   │   └── route.ts          # GET, PUT, DELETE profil
│   └── settings/
│       └── route.ts          # GET, PUT paramètres
├── globals.css               # Styles personnalisés LinkESTIAM
└── layout.tsx               # Layout racine (lang="fr")

components/
├── ProfileButton.tsx        # 🔗 Bouton d'accès profil (3 variantes)
└── ui/
    ├── button.tsx           # Composant boutons
    ├── input.tsx            # Champs de saisie
    ├── label.tsx            # Labels formulaires
    └── switch.tsx           # Toggles ON/OFF

INTEGRATION_PROFILE_BUTTON.md # 📖 Guide d'intégration
```

### 🔌 API Routes

#### **GET /api/profile**
```typescript
// Récupération données utilisateur
Response: {
  id: string,
  name: string,
  email: string,
  createdAt: Date,
  updatedAt: Date
}
```

#### **PUT /api/profile**
```typescript
// Mise à jour profil utilisateur
Body: {
  name: string,          // Requis, validation string
  email: string,         // Requis, validation email
  newPassword?: string   // Optionnel, validation string
}
```

#### **DELETE /api/profile**
```typescript
// Suppression compte utilisateur
Response: {
  message: "Compte supprimé avec succès"
}
```

#### **GET/PUT /api/settings**
```typescript
// Gestion paramètres utilisateur
Body: {
  notifications: boolean,
  darkMode: boolean
}
```

### 🔒 Sécurité

Toutes les routes API incluent des commentaires `//!` pour l'implémentation JWT :

```typescript
//! NEED TO IMPLEMENT AUTHENTICATION WITH JWT
// const userId = extractUserIdFromJWT(request)
```

**Validations strictes** :
- Types de données vérifiés
- Formats email validés
- Paramètres requis contrôlés
- Gestion d'erreurs complète

## 🚀 Utilisation

### Démarrage
```bash
npm run dev
```

### Navigation
1. **Page d'accueil** : `http://localhost:3000`
2. **Clic bouton violet** : "🔒 Voir le Profil LinkESTIAM"
3. **Accès direct** : `http://localhost:3000/profile`

### Tests fonctionnels
- ✅ Navigation Profile ↔ Settings
- ✅ Modification champs (nom, email, mot de passe)
- ✅ Toggles notifications/mode sombre
- ✅ Sauvegarde données
- ✅ Suppression compte avec confirmation
- ✅ Responsive mobile/tablet/desktop

## 🔗 Intégration dans l'Interface Principale

Votre ami peut intégrer le bouton profil en 2 étapes :

### 1. **Import du composant**
```tsx
import ProfileButton from '@/components/ProfileButton'
```

### 2. **Utilisation selon l'emplacement**
```tsx
// Header/Navbar
<ProfileButton variant="compact" />

// Sidebar/Menu
<ProfileButton variant="default" userName="Mon profil" />

// Mobile/Coin d'écran
<ProfileButton variant="icon-only" />
```

**📖 Guide complet** : `INTEGRATION_PROFILE_BUTTON.md`

## 🔧 Intégration Future

### 🔐 Authentification JWT
```typescript
// À implémenter par l'équipe auth
function extractUserIdFromJWT(request: NextRequest): string {
  // Extraction token JWT depuis headers
  // Validation et décodage
  // Retour userId
}
```

### 🗄️ Base de données
```typescript
// Décommenter imports Prisma
import { prisma } from '@/lib/prisma'

// Remplacer données simulées par vraies requêtes
const user = await prisma.user.findUnique({
  where: { id: userId }
})
```

### ⚡ Améliorations suggérées
- [ ] **Toast notifications** (remplacer `alert()`)
- [ ] **Validation temps réel** formulaires
- [ ] **Upload avatar** utilisateur
- [ ] **Historique modifications** profil
- [ ] **Confirmation email** changements
- [ ] **2FA** pour actions sensibles

## 📦 Dépendances

### Core
- **Next.js 15** : Framework React
- **TypeScript** : Typage strict
- **Tailwind CSS** : Styling utilitaire

### UI Components
- **Lucide React** : Icônes modernes
- **Radix UI** : Composants accessibles (Switch)
- **CVA** : Variants conditionnels

### Base de données (future)
- **Prisma** : ORM PostgreSQL
- **bcrypt** : Hashage mots de passe

## 🎯 Points Techniques

### Performance
- **SSR optimisé** avec Next.js 15
- **Turbopack** pour compilation rapide
- **CSS purs** pour hover effects (pas de JS)
- **Composants réutilisables** modulaires

### Accessibilité
- **Labels sémantiques** pour formulaires
- **Focus visible** sur navigation clavier
- **Contrastes couleurs** respectés
- **Structure HTML** logique

### Responsive
- **Mobile-first** approach
- **Breakpoints** : 768px (tablet), 480px (mobile)
- **Flexbox** pour layouts adaptatifs
- **Typography** scalable

---

## 📞 Support

**Équipe** : Frontend Profile Module  
**Contact** : Documentation complète dans le code  
**Status** : ✅ Prêt pour intégration JWT + Base de données 