import Fastify, { FastifyInstance } from 'fastify'

const server: FastifyInstance = Fastify({})
import { healthcheck } from "./src/routers/index"


server.register(healthcheck, { prefix: '/' });

const start = async () => {
    try {
        await server.listen({ port: 3000 })

        const address = server.server.address()
        const port = typeof address === 'string' ? address : address?.port

    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

start()