import z from "zod"

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

export { memberSchema, messageSchema }
