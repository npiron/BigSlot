# BigSlot 🎰

Un jeu vidéo de machine à sous (slot) de casino développé avec Phaser 3.

![BigSlot Game](https://github.com/user-attachments/assets/01313b28-9a72-4fc1-ac28-fd4d8ed851d9)

## Caractéristiques

- 🎮 Développé avec Phaser 3 (framework de jeu HTML5)
- 🎰 Machine à sous avec 3 rouleaux
- 💎 7 symboles différents (cerises, citron, orange, pastèque, étoile, diamant, 7)
- 💰 Système de crédits et de mises
- 🎯 Détection automatique des gains
- ✨ Animations fluides et visuels colorés
- 🎨 Interface utilisateur intuitive

## Symboles et Multiplicateurs

| Symbole | Multiplicateur |
|---------|---------------|
| 🍒 Cerises | x5 |
| 🍋 Citron | x5 |
| 🍊 Orange | x10 |
| 🍉 Pastèque | x10 |
| ⭐ Étoile | x20 |
| 💎 Diamant | x50 |
| 7️⃣ Sept | x100 |

## Installation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

### Étapes

1. Cloner le dépôt :
```bash
git clone https://github.com/npiron/BigSlot.git
cd BigSlot
```

2. Installer les dépendances :
```bash
npm install
```

## Utilisation

### Mode développement

Pour lancer le jeu en mode développement avec rechargement automatique :

```bash
npm run dev
```

Le jeu sera accessible sur `http://localhost:3000`

### Build de production

Pour créer une version optimisée pour la production :

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`

### Prévisualiser le build

Pour prévisualiser le build de production :

```bash
npm run preview
```

## Comment jouer

1. **Ajuster votre mise** : Utilisez les boutons `+` et `-` pour augmenter ou diminuer votre mise (entre 10 et 100 crédits)
2. **Lancer les rouleaux** : Cliquez sur le bouton vert `SPIN` pour faire tourner les rouleaux
3. **Gagner** : Si les trois symboles de la ligne centrale sont identiques, vous gagnez ! Le montant du gain dépend du symbole et de votre mise

### Règles

- Vous commencez avec 1000 crédits
- La mise minimale est de 10 crédits
- La mise maximale est de 100 crédits
- Vous gagnez lorsque les 3 symboles de la ligne centrale sont identiques
- Le gain = mise × multiplicateur du symbole

## Structure du projet

```
BigSlot/
├── src/
│   ├── main.js              # Point d'entrée de l'application
│   └── scenes/
│       └── GameScene.js     # Scène principale du jeu
├── index.html               # Page HTML principale
├── vite.config.js          # Configuration Vite
├── package.json            # Dépendances et scripts
└── README.md               # Documentation
```

## Technologies utilisées

- **Phaser 3** (v3.70.0) - Framework de jeu HTML5
- **Vite** (v5.0.0) - Build tool et serveur de développement
- **JavaScript ES6+** - Langage de programmation

## Licence

ISC

## Auteur

Nicolas Piron
