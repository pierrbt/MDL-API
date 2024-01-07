# MDL-API

Ce programme est l'API du site de la MDL de Livet réalisé comme projet de NSI. Il utilise le modèle REST et échange les
informations en JSON. Le
serveur HTTP est fait par le framework Fastify. Prisma est utilisé comme ORM pour la base de données SQLite.

## Informations sur le projet

Ce repository ne contient que les fichiers du serveur HTTP. Le site web est disponible dans un autre repository, mais
aussi disponible depuis le dossier `static` qui est un submodule vers le repository du site web.

J'ai décidé de séparer le site web et l'API pour avoir deux projets distincts, mais le serveur Fastify sert les fichiers
statiques sur la racine du site web. Le site web est donc accessible depuis le serveur HTTP.

Vous pouvez accéder au site web depuis [https://mdl.veagle.fr](https://mdl.veagle.fr) ou vous pouvez le lancer
localement avec les instructions ci-dessous.

Cette version du site contient la possibilité de s'inscrire à partir d'un formulaire HTML qui envoie les données au
serveur. Dans l'autre sens, le JavaScript récupère les données depuis l'API et les affiche sur la page. Les données du
formulaire sont envoyées sous le format JSON qui est géré par le JS au lieu d'utiliser "action" même si cela est
possible, car je trouvais que c'était mieux de gérer tout en JavaScript notamment pour gérer les erreurs et afficher des
beaux messages d'erreurs. Je n'ai pas intégré la possibilité d'envoyer des messages et les lire, mais cela est possible
grâce aux routes déjà présentes du côté serveur.

J'ai surtout accentué le fait d'utiliser de nombreux tags HTML pour organiser le site, et aussi de rendre le site
dynamique avec pas mal de pages faites en JavaScript. Le style de la page est certes assez simpliste et pas forcément
très représentatif de la MDL, mais je voulais
surtout me concentrer sur le côté dynamique et fonctionnel du site. J'ai toutefois utilisé de nombreuses fonctionnalités
de placement, de bordure, de couleur, de sélection, transition, etc.

## Caractéristiques Techniques

- **Serveur HTTP** : Fastify
- **ORM** : Prisma
- **Base de données** : SQLite
- **Validation des données** : Zod
- **Langage de programmation** : JavaScript (runtime Node.js)

## Installation

Pour installer et exécuter ce projet, suivez les étapes suivantes :

```bash
git clone https://github.com/pierrbt/MDL-API.git Site-MDL --recursive # Clone du projet
cd Site-MDL # Déplacement dans le dossier

pnpm i      # Installation des dépendances
pnpm exec prisma generate # Génération client Prisma
pnpm exec prisma db push # Génération DB Prisma
pnpm dev    # Lancement en dev

# Pour la version de production :
pnpm build  # Build stable et minifié
pnpm prune --prod # Suppression des dépendances de dev
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
- Dernière modification : 2024/01
