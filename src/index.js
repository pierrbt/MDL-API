/**
 Ce programme est l'API du site de la MDL de Livet,
 Il utilise le modèle REST et échange les informations en JSON,
 Le serveur HTTP est fait par le framework Fastify,
 J'utilise Prisma comme ORM pour la base de données SQLite.

 Dans le configuration du serveur, le processus Node est placé derrière
 un reverse-proxy Apache2 sur Debian.

 Auteur: Pierre BIDET
 Licence : MIT

 Dernière modification: 2023/12
 */

const PORT = 5445 // Port par défaut pour Fastify

import Fastify from "fastify" // Fastify pour le serveur Web
import { PrismaClient } from "@prisma/client" // Prisma en ORM
import { memberSchema, messageSchema } from "./validators.js" // Schémas Zod
import process from "node:process" // Process pour quitter
import cors from "@fastify/cors" // CORS pour les requêtes distantes
import helmet from "@fastify/helmet" // Helmet pour les headers de sécurité
import formbody from "@fastify/formbody" // Parser pour les forms

import { join } from "node:path" // Path pour les chemins

// On créé les interfaces pour l'API et la DB
const prisma = new PrismaClient()
const server = Fastify()

// On ajoute les plugins cors et helmet pour mettre des headers de sécurité
server.register(cors)
server.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      "default-src": ["self", "https://api.mdl.veagle.fr"],
    },
  },
})

server.register(formbody)

// On configure le serveur pour envoyer les fichiers statiques du site
server.register(await import("@fastify/static"), {
  root: join(process.cwd(), "./static"),
  prefix: "/",
})

// On définit les routes avec server.METHOD(ROUTE, HANDLER)
server.get("/api/members", async (request, reply) => {
  try {
    const members = await prisma.member.findMany() // findMany pour récupérer toute la table
    return { message: "Successfully fetched members.", data: members } // On renvoie les membres
  } catch (err) {
    // Si il y a une erreur avec Prisma, on arrive dans le catch
    return reply
      .code(500)
      .send({ message: "Error while fetching members!", error: err })
  }
})

server.post("/api/members", async (request, reply) => {
  try {
    // On utilise le schéma Zod pour vérifier l'entrée de l'utilisateur
    const member = await memberSchema.safeParse(request.body)
    if (!member.success) {
      // Si l'entrée n'est pas bonne, on envoie une erreur Bad Request
      return reply
        .code(400)
        .send({ message: "Invalid parameters", error: member.error.message })
    }
    // On créé notre utilisateur et on l'envoie
    const createdMember = await prisma.member.create({
      data: member.data,
    })
    return { message: "Successfully added member.", data: createdMember }
  } catch (err) {
    // Si quelque chose ne marche pas avec Prisma ou un autre problème, on envoie une erreur 500
    return reply
      .code(500)
      .send({ message: "Unexpected error while adding member", error: err })
  }
})

// C'est exactement la même logique pour les messages de contact :

server.get("/api/messages", async (request, reply) => {
  try {
    const messages = await prisma.message.findMany()
    return { message: "Successfully fetched messages", data: messages }
  } catch (err) {
    return reply.code(500).send({
      message: "Unexpected error while fetching messages.",
      error: err,
    })
  }
})

server.post("/api/messages", async (request, reply) => {
  try {
    const message = await messageSchema.safeParse(request.body)
    if (!message.success) {
      return reply
        .code(400)
        .send({ message: "Invalid parameters", error: message.error })
    } else {
      const createdMessage = await prisma.message.create({
        data: message.data,
      })
      return reply.code(200).send({
        message: "Successfully created a new message.",
        data: createdMessage,
      })
    }
  } catch (err) {
    return reply
      .code(500)
      .send({ message: "Unexpected error while adding a message.", error: err })
  }
})

server.setNotFoundHandler((request, reply) => {
  reply.code(404).send({ message: "Not Found" })
})

// On définit la route pour la page d'accueil
server.get("/", async (request, reply) => {
  return reply.sendFile("index.html")
})

// On quitte la DB avant de terminer le processus
process.on("beforeExit", async () => {
  await prisma.$disconnect()
  console.log("🛑 Server stopped !")
})

try {
  // On connecte la DB puis on lance le serveur HTTP sur le port défini
  await prisma.$connect()
  const hostname = await server.listen({ port: PORT })
  console.log(`🚀 Server listening on ${hostname}`)
} catch (err) {
  server.log.error(err)
  process.exit(1)
}
