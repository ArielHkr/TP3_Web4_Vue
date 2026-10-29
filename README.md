# CampXplore

**CampXplore** est une application web de consultation et de réservation d'emplacements de camping, réalisée avec **Vue 3** et **Vite** dans le cadre du projet TP3 du cours de développement Web 4.

Elle permet aux visiteurs de découvrir des emplacements et de rechercher des disponibilités. Les utilisateurs connectés peuvent réserver et gérer leurs réservations. Une interface d'administration permet de gérer les emplacements et les statuts des réservations.

> **Périmètre du dépôt :** ce dépôt contient l'application frontend dans le dossier `CampXplore/` et un dossier `PostMan/`. Le frontend communique avec une API REST externe, qui doit être accessible pour utiliser les fonctionnalités liées aux données.

## Fonctionnalités

### Visiteurs

- Consulter la liste des emplacements et filtrer par type.
- Consulter les détails d'un emplacement : localisation, description, prix par nuit, capacité et commodités.
- Rechercher les emplacements disponibles selon les dates, le nombre de personnes et le type de camping.
- Créer un compte et se connecter.

### Utilisateurs connectés

- Réserver un emplacement pour une période et un nombre de campeurs donnés.
- Indiquer la longueur du véhicule lorsque nécessaire, notamment pour les emplacements VR.
- Consulter le détail et le statut de ses réservations.
- Annuler une réservation en attente.
- Consulter et modifier les informations de son profil.
- Changer son mot de passe et se déconnecter.

### Administration

- Consulter les emplacements enregistrés.
- Créer, modifier et archiver un emplacement.
- Consulter les réservations.
- Confirmer, annuler ou remettre en attente une réservation.

L'accès aux fonctionnalités administratives dépend des autorisations accordées par l'API. Les routes protégées utilisent un jeton JWT et, pour certaines pages, une vérification du rôle `admin`.

## Technologies utilisées

| Technologie | Utilisation |
| --- | --- |
| Vue 3 | Interface utilisateur et composants |
| Vite | Serveur de développement et compilation |
| Vue Router | Navigation et protection de routes |
| Pinia | Gestion de l'état de l'application |
| Bootstrap 5 | Mise en page et composants visuels |
| Bootstrap Icons | Icônes |
| jwt-decode | Lecture du rôle présent dans le JWT |
| Fetch API | Requêtes HTTP vers l'API REST |
| ESLint, Oxlint et Prettier | Vérification et mise en forme du code |

## Prérequis

- **Git** ;
- **Node.js** : version `20.19.0` ou supérieure dans la branche 20, ou version `22.12.0` ou supérieure (selon la configuration du projet) ;
- **npm** ;
- une **API REST compatible** avec les routes utilisées par CampXplore.

## Installation et lancement

### 1. Cloner le dépôt

```bash
git clone https://github.com/ArielHkr/TP3_Web4_Vue.git
cd TP3_Web4_Vue/CampXplore
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` dans le dossier `CampXplore/` :

```dotenv
VITE_API_URL=http://localhost:3000
VITE_API_KEY=votre_cle_api
```

- `VITE_API_URL` : adresse de base du backend, **sans** `/api` à la fin. L'adresse locale ci-dessus est un exemple à adapter à votre API.
- `VITE_API_KEY` : valeur attendue par le backend dans l'en-tête HTTP `x-api-key`.

**Important :** les variables préfixées `VITE_` sont intégrées au code exécuté dans le navigateur. N'y placez jamais de secret devant rester confidentiel. L'API doit vérifier elle-même les autorisations et les droits d'accès. Le fichier `.env` est exclu du suivi Git par la configuration actuelle.

### 4. Démarrer l'application

```bash
npm run dev
```

Ouvrir l'adresse locale indiquée par Vite dans le terminal (habituellement `http://localhost:5173`).

> Les pages peuvent s'afficher sans backend, mais l'authentification, les listes, la recherche et les réservations nécessitent une API fonctionnelle, configurée pour autoriser les requêtes du frontend (CORS).

## Commandes disponibles

À exécuter dans `CampXplore/` :

| Commande | Description |
| --- | --- |
| `npm run dev` | Démarre le serveur de développement Vite. |
| `npm run build` | Génère la version de production dans `dist/`. |
| `npm run preview` | Permet de prévisualiser la version compilée. |
| `npm run lint` | Lance les vérifications Oxlint et ESLint avec corrections automatiques. |
| `npm run format` | Formate les fichiers de `src/` avec Prettier. |

Aucun script de tests automatisés n'est défini dans le `package.json` actuellement consulté.

## Structure du projet

```text
TP3_Web4_Vue/
├── CampXplore/
│   ├── src/
│   │   ├── assets/           # Images et styles
│   │   ├── components/       # Composants réutilisables (navigation, cartes...)
│   │   ├── router/           # Routes et gardes de navigation
│   │   ├── stores/           # Stores Pinia : auth, campsite, reservation
│   │   ├── views/            # Pages de l'application
│   │   ├── App.vue           # Composant racine
│   │   └── main.js           # Initialisation de Vue, Pinia et du routeur
│   ├── package.json
│   └── vite.config.js
└── PostMan/                   # Ressources Postman du dépôt
```

## Navigation principale

| Route | Page | Accès prévu |
| --- | --- | --- |
| `/` | Accueil et recherche de disponibilités | Public |
| `/campsites` | Liste des emplacements | Public |
| `/campsites/:id` | Détails et formulaire de réservation | Consultation publique, réservation avec connexion |
| `/register` | Inscription | Public |
| `/login` | Connexion | Public |
| `/reservations` | Réservations | Connecté |
| `/reservations/:id` | Détails d'une réservation | Connecté |
| `/profil` | Profil | Connecté |
| `/resetPassword` | Changement de mot de passe | Connecté |
| `/AdminReservations` | Gestion des réservations | Administrateur |
| `/AdminCampsites` | Gestion des emplacements | Page d'administration (voir note ci-dessous) |
| `/admin/campsites/creer` | Création d'emplacement | Page d'administration (voir note ci-dessous) |
| `/admin/campsites/:id/modifier` | Modification d'emplacement | Administrateur |

**Note :** dans l'état actuel du routeur, les routes `/AdminCampsites` et `/admin/campsites/creer` n'ont pas de métadonnées de protection explicites. Les opérations sensibles doivent impérativement être autorisées côté API, indépendamment de la navigation frontend.

## Communication avec l'API

L'application envoie ses requêtes HTTP à l'adresse indiquée par `VITE_API_URL`, généralement avec l'en-tête `x-api-key`. Les opérations authentifiées utilisent également :

```http
Authorization: Bearer <jeton_JWT>
```

Le JWT obtenu à la connexion est actuellement stocké dans le `localStorage` du navigateur.

### Principales routes API utilisées

| Méthode | Endpoint | Utilisation |
| --- | --- | --- |
| `GET` | `/api/campsites` | Lister les emplacements ; filtre facultatif `?type=...` |
| `GET` | `/api/campsites/:id` | Consulter un emplacement |
| `GET` | `/api/campsites/available` | Rechercher par `startDate`, `endDate`, `capacity` et éventuellement `type` |
| `POST` | `/api/campsites` | Créer un emplacement |
| `PUT` | `/api/campsites/:id` | Modifier un emplacement |
| `DELETE` | `/api/campsites/:id` | Archiver un emplacement via l'API |
| `POST` | `/api/auth/register` | Inscription |
| `POST` | `/api/auth/login` | Connexion |
| `GET`, `PUT` | `/api/auth/profile` | Consultation et modification du profil |
| `PUT` | `/api/auth/password` | Modification du mot de passe |
| `GET`, `POST` | `/api/reservations` | Liste et création des réservations |
| `GET`, `PUT`, `PATCH` | `/api/reservations/:id` | Détails, modification et mise à jour du statut |

Les requêtes `PATCH /api/reservations/:id` envoient notamment les valeurs de statut `pending`, `confirmed` ou `cancelled`. Les réponses exploitées par l'interface utilisent principalement la propriété JSON `data`.

**Documentation Postman :** [Consulter la documentation de l'API](https://documenter.getpostman.com/view/53121580/2sBXqQFd5a).

## Déploiement

1. Configurer `VITE_API_URL` et `VITE_API_KEY` pour l'environnement cible.
2. Exécuter `npm run build` dans `CampXplore/`.
3. Déployer le contenu de `CampXplore/dist/` sur un hébergement compatible avec les applications Vue monopages (SPA).
4. Configurer la réécriture des routes vers `index.html` afin que les URLs gérées par Vue Router restent accessibles après actualisation.
5. Vérifier la configuration CORS, HTTPS et les autorisations côté backend.

## Auteur

**Ariel Namfaim** — [GitHub : ArielHkr](https://github.com/ArielHkr)

## Dépôt

[github.com/ArielHkr/TP3_Web4_Vue](https://github.com/ArielHkr/TP3_Web4_Vue)
