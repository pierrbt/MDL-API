import Fastify from 'fastify' // Fastify pour le serveur Web
import { PrismaClient } from '@prisma/client' // Prisma en ORM
import z from "zod" // Zod pour la validation des entrées

const prismaClient = new PrismaClient()
const server = Fastify()

const memberSchema = z.object({ // On créé l'objet de validation des membres
  firstName: z.string().min(2).max(20),
  lastName: z.string().min(2).max(20),
  age: z.number().min(10).max(99),
  role: z.string(),
  class: z.string()
})

const messageSchema = z.object({
  author: z.string(),
  message: z.string().min(5),
  email: z.string().email()
})


server.get("/members", async (request, reply) => {
  try {
    const members = await prismaClient.member.findMany();
    return { message: "Successfully fetched members.", data: members }
  } catch (err) {
    reply
      .code(500)
      .send({ message: "Error while fetching members!" })
  }
});

server.post("/members", async (request, reply) => {
  try {
    const member = await memberSchema.safeParse(request.body)
    if (!member.success) {
      return reply.code(400).send({ message: "Invalid parameters", error: member.error })
    } else {
      const createdMember = await prismaClient.member.create({
        data: member.data
      })
      return { message: "Successfully added member.", data: createdMember }
    }
  } catch (err) {
    reply.code(500).send({ message: "Unexpected error while adding member", error: err })
  }
})

server.get("/messages", async (request, reply) => {
  reply
    .code(501)
    .send({ message: "Not implemented yet!" })
})

server.post("/messages", async (request, reply) => {
  reply
    .code(501)
    .send({ message: "Not implemented yet!" })
})

const PORT = 3000;

try {
  await prismaClient.$connect();
  const hostname = await server.listen({ port: PORT })
  console.log(`🚀 Server listening on ${hostname}`)
} catch (err) {
  server.log.error(err)
  await prismaClient.$disconnect();
  process.exit(1)
}
