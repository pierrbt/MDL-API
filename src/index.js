const PORT = 3000 // Port par défaut pour Fastify

import Fastify from "fastify" // Fastify pour le serveur Web
import { PrismaClient } from "@prisma/client" // Prisma en ORM
import { memberSchema, messageSchema } from "./validators.js" // Schémas Zod
import process from "node:process"
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"

// On créé les interfaces pour l'API et la DB
const prisma = new PrismaClient()
const server = Fastify()

// On ajoute les plugins cors et helmet pour mettre des headers de sécurité
server.register(cors)
server.register(helmet)

server.get("/members", async (request, reply) => {
  try {
    const members = await prisma.member.findMany() // findMany pour récupérer toute la table
    return { message: "Successfully fetched members.", data: members } // On renvoie les membres
  } catch (err) {
    // Si il y a une erreur avec Prisma, on arrive dans le catch
    return reply.code(500).send({ message: "Error while fetching members!" })
  }
})

server.post("/members", async (request, reply) => {
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

server.get("/messages", async (request, reply) => {
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

server.post("/messages", async (request, reply) => {
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

// On fait quand même une page de bienvenue si quelqu'un vient à la racine du site
server.all("/", async (request, reply) => {
  try {
    const memberCount = await prisma.member.count()
    const messageCount = await prisma.message.count()
    return {
      message:
        "Welcome on the MDL-API. This is the backend API for the Livet's MDL website. You can see some stats below",
      stats: `There is currently ${memberCount} member(s) registered and ${messageCount} message(s) available !`,
    }
  } catch (err) {
    return reply.code(500).send({
      message:
        "Welcome on the MDL-API. This is the backend API for the Livet's MDL website, but unfortunately, the DB seems down for the moment!",
    })
  }
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
