# 🚀 Script de Déploiement Automatique GitHub - Streamior Next Pro
# Usage: .\deploy-github.ps1

Write-Host "🚀 Début du déploiement GitHub - Streamior Next Pro" -ForegroundColor Green

# Vérifier si Git est installé
try {
    $gitVersion = git --version
    Write-Host "✅ Git détecté: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé. Veuillez l'installer depuis: https://git-scm.com/download/windows" -ForegroundColor Red
    exit 1
}

# Vérifier si on est dans le bon dossier
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Ce script doit être exécuté depuis le dossier racine du projet" -ForegroundColor Red
    exit 1
}

# Vérifier le nom du projet
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if ($packageJson.name -ne "streamior-next-pro") {
    Write-Host "❌ Ce script est conçu pour le projet streamior-next-pro" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Projet détecté: $($packageJson.name) v$($packageJson.version)" -ForegroundColor Cyan

# 1. Initialiser Git si nécessaire
if (-not (Test-Path ".git")) {
    Write-Host "🎯 Initialisation du repository Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repository Git initialisé" -ForegroundColor Green
} else {
    Write-Host "✅ Repository Git déjà initialisé" -ForegroundColor Green
}

# 2. Configurer Git (demander à l'utilisateur)
$userName = git config --get user.name
$userEmail = git config --get user.email

if (-not $userName) {
    $userName = Read-Host "Entrez votre nom Git"
    git config user.name "$userName"
}

if (-not $userEmail) {
    $userEmail = Read-Host "Entrez votre email Git"
    git config user.email "$userEmail"
}

Write-Host "✅ Configuration Git: $userName <$userEmail>" -ForegroundColor Green

# 3. Vérifier le statut actuel
Write-Host "📊 Vérification du statut..." -ForegroundColor Yellow
$gitStatus = git status --porcelain

if ($gitStatus) {
    Write-Host "📝 Fichiers modifiés détectés:" -ForegroundColor Cyan
    git status --short
    
    # 4. Ajouter tous les fichiers
    Write-Host "📦 Ajout de tous les fichiers..." -ForegroundColor Yellow
    git add .
    
    # 5. Créer le commit
    $commitMessage = @"
🎉 Initial commit: Streamior Next Pro with Firebase Auth

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
- TypeScript + ESLint + Prettier

🚀 Ready for production deployment!
"@

    Write-Host "💾 Création du commit..." -ForegroundColor Yellow
    git commit -m $commitMessage
    Write-Host "✅ Commit créé avec succès" -ForegroundColor Green
} else {
    Write-Host "✅ Aucune modification à commiter" -ForegroundColor Green
}

# 6. Configurer l'origine GitHub
$remoteUrl = "https://github.com/Templaoo/streamior-next.git"
$existingRemote = git remote get-url origin 2>$null

if (-not $existingRemote) {
    Write-Host "🔗 Ajout de l'origine GitHub..." -ForegroundColor Yellow
    git remote add origin $remoteUrl
    Write-Host "✅ Origine GitHub ajoutée: $remoteUrl" -ForegroundColor Green
} else {
    if ($existingRemote -ne $remoteUrl) {
        Write-Host "🔄 Mise à jour de l'origine GitHub..." -ForegroundColor Yellow
        git remote set-url origin $remoteUrl
        Write-Host "✅ Origine GitHub mise à jour: $remoteUrl" -ForegroundColor Green
    } else {
        Write-Host "✅ Origine GitHub déjà configurée: $remoteUrl" -ForegroundColor Green
    }
}

# 7. Créer/changer vers la branche main
$currentBranch = git rev-parse --abbrev-ref HEAD 2>$null
if ($currentBranch -ne "main") {
    Write-Host "🌿 Création/changement vers la branche main..." -ForegroundColor Yellow
    git branch -M main
    Write-Host "✅ Branche main configurée" -ForegroundColor Green
}

# 8. Pousser vers GitHub
Write-Host "🚀 Push vers GitHub..." -ForegroundColor Yellow
try {
    git push -u origin main
    Write-Host "✅ Code déployé avec succès sur GitHub!" -ForegroundColor Green
    
    # 9. Afficher le lien du repository
    Write-Host ""
    Write-Host "🌟 Votre projet est maintenant disponible sur:" -ForegroundColor Cyan
    Write-Host "   👉 https://github.com/Templaoo/streamior-next" -ForegroundColor Blue
    Write-Host ""
    Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
    Write-Host "   1. Vérifiez que tous les fichiers sont présents sur GitHub"
    Write-Host "   2. Configurez les variables d'environnement pour la production"
    Write-Host "   3. Déployez sur Vercel en connectant le repository"
    Write-Host "   4. Déployez les règles Firebase avec: firebase deploy --only firestore:rules"
    
} catch {
    Write-Host "❌ Erreur lors du push vers GitHub:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    Write-Host ""
    Write-Host "🔧 Solutions possibles:" -ForegroundColor Yellow
    Write-Host "   1. Vérifiez vos permissions sur le repository GitHub"
    Write-Host "   2. Assurez-vous d'être connecté à GitHub (git credential manager)"
    Write-Host "   3. Essayez manuellement: git push --force-with-lease origin main"
}

Write-Host ""
Write-Host "🎯 Déploiement terminé!" -ForegroundColor Green
