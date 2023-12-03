import Fastify from "fastify" // Fastify pour le serveur Web
import { PrismaClient } from "@prisma/client" // Prisma en ORM
import { memberSchema, messageSchema } from "./validators.js"
import process from "node:process"

const prisma = new PrismaClient()
const server = Fastify()

server.get("/members", async (request, reply) => {
  try {
    const members = await prisma.member.findMany()
    return { message: "Successfully fetched members.", data: members }
  } catch (err) {
    return reply.code(500).send({ message: "Error while fetching members!" })
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
      const createdMember = await prisma.member.create({
        data: member.data,
      })
      return { message: "Successfully added member.", data: createdMember }
    }
  } catch (err) {
    return reply
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

const PORT = 3000

process.on("beforeExit", async () => {
  await prisma.$disconnect()
  console.log("🛑 Server stopped !")
})

try {
  await prisma.$connect()
  const hostname = await server.listen({ port: PORT })
  console.log(`🚀 Server listening on ${hostname}`)
} catch (err) {
  server.log.error(err)
  process.exit(1)
}
