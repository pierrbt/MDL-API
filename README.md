# MDL-API

Ce programme est l'API du site de la MDL de Livet. Il utilise le modèle REST et échange les informations en JSON. Le
serveur HTTP est fait par le framework Fastify. Prisma est utilisé comme ORM pour la base de données SQLite.

## Caractéristiques Techniques

- **Serveur HTTP** : Fastify
- **ORM** : Prisma
- **Base de données** : SQLite
- **Validation des données** : Zod
- **Langage de programmation** : JavaScript

## Installation

Pour installer et exécuter ce projet, suivez les étapes suivantes :

```bash
pnpm i      # Installation des dépendances
pnpm exec prisma generate # Génération client Prisma
pnpm exec prisma db push # Génération DB Prisma
pnpm dev    # Lancement en dev

# Pour la version de production :
pnpm build  # Build stable et minifié
pnpm start  # Lancement du build
```

## API Endpoints

L'API contient 4 endpoints pour 2 fonctionnalités différentes :

### Gestion des membres

- `GET /api/members` : Renvoie une liste des membres sous forme `{data: User[]}`
- `POST /api/members` `<firstName, lastName, role, class, age>` : Créé un utilisateur sur le serveur, possibilité
  d'envoyer en body JSON ou bien en x-www-form-urlencoded (à partir d'un formulaire HTML)

### Gestion de la messagerie

- `GET /api/messages` : Renvoie une liste des messages sous forme `{data: Message[]}`
- `POST /api/messages` `<author, message, email>` : Créé un nouveau message, possibilité d'envoyer en body JSON ou bien
  en x-www-form-urlencoded (à partir d'un formulaire HTML)

## Configuration

Dans la configuration du serveur, le processus Node est placé derrière un reverse-proxy Apache2 sur Debian. Le processus
Node est lancé depuis `pm2`.

## Licence

Ce projet est sous licence MIT.

## Auteur

- Auteur: Pierre BIDET
- Dernière modification : 2023/12
