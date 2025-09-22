# 🚀 Guide de Déploiement GitHub - Streamior Next Pro

## Prérequis

1. **Installer Git** (si pas déjà fait) :
   - Téléchargez depuis : https://git-scm.com/download/windows
   - Ou via Chocolatey : `choco install git`

2. **Compte GitHub** configuré avec SSH ou HTTPS

## Étapes de Déploiement

### 1️⃣ Initialiser le Repository Git

```bash
cd "C:\Users\hamma\OneDrive\Documents\PROJET WEB\streamior-next\streamior-next-pro"

# Initialiser Git
git init

# Configurer votre identité (si pas déjà fait globalement)
git config user.name "Votre Nom"
git config user.email "votre.email@example.com"
```

### 2️⃣ Préparer les Fichiers

**✅ Fichiers qui SERONT inclus :**
- ✅ `src/` - Code source complet
- ✅ `messages/` - Traductions FR/EN  
- ✅ `public/` - Assets publics
- ✅ `package.json` - Configuration projet
- ✅ `tsconfig.json` - Configuration TypeScript
- ✅ `next.config.ts` - Configuration Next.js
- ✅ `tailwind.config.ts` - Configuration Tailwind
- ✅ `eslint.config.mjs` - Configuration ESLint
- ✅ `firebase.json` - Configuration Firebase
- ✅ `firestore.rules` - Règles Firestore
- ✅ `firestore.indexes.json` - Index Firestore
- ✅ `.env.example` - Template variables d'environnement
- ✅ `README.md` - Documentation

**❌ Fichiers qui seront IGNORÉS :**
- ❌ `.env.local` - Variables sensibles
- ❌ `node_modules/` - Dépendances
- ❌ `.next/` - Build cache
- ❌ `.turbo/` - Cache Turbo

### 3️⃣ Créer le Premier Commit

```bash
# Ajouter tous les fichiers
git add .

# Vérifier les fichiers ajoutés
git status

# Créer le commit initial
git commit -m "🎉 Initial commit: Streamior Next Pro with Firebase Auth

✨ Features:
- Next.js 15 with App Router & TypeScript
- Firebase Authentication (Google Sign-in)
- Secured Dashboard with responsive sidebar  
- Multi-language support (EN/FR)
- shadcn/ui components + Tailwind CSS
- Firestore user synchronization
- Loading skeletons & error handling

🔧 Tech Stack:
- Next.js 15.5.3 + React 19
- Firebase Auth + Firestore
- next-intl for i18n
- shadcn/ui + Tailwind CSS v4
- TypeScript + ESLint + Prettier"
```

### 4️⃣ Connecter au Repository GitHub

```bash
# Ajouter l'origine GitHub
git remote add origin https://github.com/Templaoo/streamior-next.git

# Vérifier la connexion
git remote -v

# Créer et pousser sur la branche main
git branch -M main
git push -u origin main
```

### 5️⃣ Vérification

1. **Visitez** : https://github.com/Templaoo/streamior-next
2. **Vérifiez** que tous les fichiers sont présents
3. **Confirmez** que `.env.local` n'est PAS visible (sécurité)

## 📋 Configuration Post-Déploiement

### Variables d'Environnement pour Production

Créez les variables suivantes dans votre environnement de déploiement :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBqBX_rH_1T5g4qJoqJWpx1r37bbw4T-3w
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=streamior-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=streamior-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=streamior-app.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=239409058156
NEXT_PUBLIC_FIREBASE_APP_ID=1:239409058156:web:9ab7f867752ed8c2256349
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-00DRVGNVKW
NODE_ENV=production
```

### Déploiement Vercel (Recommandé)

1. **Connectez** votre repo GitHub à Vercel
2. **Ajoutez** les variables d'environnement dans Vercel Dashboard
3. **Déployez** automatiquement

### Firebase Rules Deployment

```bash
# Déployer les règles Firestore
firebase deploy --only firestore:rules

# Déployer les index
firebase deploy --only firestore:indexes
```

## 🆘 Résolution de Problèmes

### Erreur "Repository not found"
```bash
# Vérifier l'URL du repo
git remote get-url origin

# Corriger si nécessaire
git remote set-url origin https://github.com/Templaoo/streamior-next.git
```

### Conflit de branches
```bash
# Forcer le push (première fois uniquement)
git push --force-with-lease origin main
```

### Gros fichiers ignorés
```bash
# Voir les fichiers ignorés
git status --ignored

# Forcer l'ajout d'un fichier spécifique si nécessaire
git add -f nom-du-fichier
```

## 🎯 Résultat Final

Une fois terminé, votre repository contiendra :
- ✅ Code source complet et fonctionnel
- ✅ Build réussi (`npm run build`)
- ✅ Documentation complète
- ✅ Configuration Firebase prête
- ✅ Variables d'environnement sécurisées
- ✅ Prêt pour le déploiement

**🚀 Votre Streamior Next Pro sera maintenant disponible sur GitHub !**
