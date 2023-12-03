import Fastify from "fastify" // Fastify pour le serveur Web
import { PrismaClient } from "@prisma/client" // Prisma en ORM
import z from "zod" // Zod pour la validation des entrées

const prisma = new PrismaClient()
const server = Fastify()

const memberSchema = z.object({
  // On créé l'objet de validation des membres
  firstName: z.string().min(2).max(20),
  lastName: z.string().min(2).max(20),
  age: z.number().min(10).max(99),
  role: z.string(),
  class: z.string(),
})

const messageSchema = z.object({
  author: z.string(),
  message: z.string().min(5),
  email: z.string().email(),
})

server.get("/members", async (request, reply) => {
  try {
    const members = await prisma.member.findMany()
    return { message: "Successfully fetched members.", data: members }
  } catch (err) {
    reply.code(500).send({ message: "Error while fetching members!" })
  }
})

server.post("/members", async (request, reply) => {
  try {
    const member = await memberSchema.safeParse(request.body)
    if (!member.success) {
      return reply
        .code(400)
        .send({ message: "Invalid parameters", error: member.error })
    } else {
      const createdMember = await prismaClient.member.create({
        data: member.data,
      })
      return { message: "Successfully added member.", data: createdMember }
    }
  } catch (err) {
    reply
      .code(500)
      .send({ message: "Unexpected error while adding member", error: err })
  }
})

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
      reply
        .code(400)
        .send({ message: "Invalid parameters", error: message.error })
    } else {
      const createdMessage = await prisma.message.create({
        data: message.data,
      })
      reply.code(200).send({
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

server.all("/", async () => {
  return { message: "Welcome on the MDL-API. This is excellent API !" }
})

const PORT = 3000

try {
  await prisma.$connect()
  const hostname = await server.listen({ port: PORT })
  console.log(`🚀 Server listening on ${hostname}`)
} catch (err) {
  server.log.error(err)
  await prisma.$disconnect()
  process.exit(1)
}
