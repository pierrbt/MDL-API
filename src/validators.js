import z from "zod" // Zod pour la validation des entrées

const memberSchema = z.object({
  // On créé l'objet de validation des membres
  firstName: z.string().min(2).max(20),
  lastName: z.string().min(2).max(20),
  age: z.coerce.number(),
  role: z.string(),
  class: z.string(),
})

const messageSchema = z.object({
  // On créé l'objet de validation des messages
  author: z.string(),
  message: z.string().min(5),
  email: z.string().email(),
})

export { memberSchema, messageSchema }
