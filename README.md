# MDL-API

Ce programme est l'API du site de la MDL de Livet

## Description Technique

Il utilise le modèle REST et échange les informations en JSON.
Le serveur HTTP est fait par le framework Fastify.

J'utilise Prisma comme ORM pour la base de données SQLite.

## Configuration en l'état

Dans le configuration du serveur, le processus Node est placé derrière
un reverse-proxy Apache2 sur Debian.

Le processus Node est lancé depuis `pm2`

## Installation


```bash
pnpm i      # Installation des dépendances
pnpm exec prisma generate # Génération client Prisma
pnpm exec prisma db push # Génération DB Prisma
pnpm dev    # Lancement en dev

# Pour la version de production : 
pnpm build  # Build stable et minifié
pnpm start  # Lancement du build
```
## Auteur et licence

- Auteur: Pierre BIDET

- Licence : MIT

- Dernière modification : 2023/12
