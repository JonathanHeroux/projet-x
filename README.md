# Projet X — Clone de Twitter/X

**Démo :** https://x.jonathanheroux.com

## Présentation

Projet X est un projet réalisé dans le cadre de ma formation en développement web chez Believemy.

L'objectif est de reproduire certaines fonctionnalités principales du réseau social X (anciennement Twitter), en utilisant React pour le frontend et PHP/MySQL pour le backend.

Ce projet m'a permis de mettre en pratique la communication entre une interface React, une API PHP et une base de données.

## Technologies utilisées

**Frontend**

- React avec Vite
- JavaScript (JSX)
- Tailwind CSS
- React Router

**Backend**

- PHP
- MySQL
- PDO pour les requêtes SQL
- Architecture MVC simplifiée

**Outils**

- Git et GitHub
- XAMPP pour le développement local
- Hostinger pour l'hébergement

## Fonctionnalités principales

- Inscription et connexion des utilisateurs
- Déconnexion et gestion des sessions
- Création, modification et suppression de publications
- Réponses aux publications
- Suivre et ne plus suivre des utilisateurs
- Fil d'actualité des comptes suivis
- Affichage des profils et modification de l'avatar
- Interface responsive inspirée de X

Certaines parties de l'interface sont présentes uniquement à titre visuel et ne possèdent pas encore de fonctionnalités.

## Structure du projet

```text
projet-x/
├── frontend/       # Interface React
├── backend/        # API PHP et base de données
└── deployment/     # Configuration du déploiement
```

## Organisation du projet

````text
projet-x/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/       # Composants d'interface
│   │   ├── pages/            # Pages de l'application
│   │   ├── layouts/          # Mise en page commune
│   │   └── services/         # Requêtes vers l'API
│   └── public/               # Ressources statiques
├── backend/                  # API PHP
│   ├── config/               # Connexion à la base de données
│   ├── controllers/          # Traitement des requêtes
│   ├── models/               # Accès aux données
│   ├── routes/               # Déclaration des endpoints
│   ├── core/                 # Routage PHP
│   └── public/               # Point d'entrée et fichiers téléversés
└── deployment/hostinger/     # Configuration spécifique au déploiement

Le frontend envoie des requêtes HTTP à l'API PHP. Les contrôleurs traitent les demandes, utilisent les modèles pour communiquer avec MySQL, puis renvoient les données au frontend au format JSON.

## Installation en local

1. Cloner le dépôt GitHub.
2. Installer les dépendances du frontend :

   ```bash
   cd frontend
   npm install
   npm run dev
````

3. Démarrer Apache et MySQL avec XAMPP.
4. Créer la base de données MySQL et importer les tables nécessaires.
5. Configurer la connexion à la base de données dans `backend/config/database.php`.
6. Démarrer le backend PHP et vérifier que le frontend communique correctement avec l'API.

## Déploiement

Le projet est hébergé sur Hostinger.

Le frontend React est compilé avec `npm run build`, puis les fichiers générés sont envoyés sur le serveur.

Le backend PHP communique avec une base de données MySQL hébergée sur Hostinger.

## Ce que j'ai appris

Ce projet m'a permis de mieux comprendre :

- La gestion des composants et des états avec React.
- Les requêtes HTTP entre frontend et backend.
- L'utilisation des contrôleurs et des modèles en PHP.
- La gestion des utilisateurs et des données avec MySQL.
- L'organisation d'un projet full-stack.
- Le déploiement et les différences entre un environnement local et un serveur de production.
