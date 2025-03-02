import Fastify, { FastifyInstance } from 'fastify'
import mercurius from 'mercurius'

const server: FastifyInstance = Fastify({})
import { healthcheck } from "./src/routers/index"

server.register(healthcheck, { prefix: '/' })

// Registra mercurius en el servidor Fastify
import { schema, resolvers } from './src/graphql'

server.register(mercurius, {
  schema,
  resolvers,
  graphiql: true
})

const start = async () => {
  try {
    await server.listen({ port: 4000 })

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()