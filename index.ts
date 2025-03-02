// Limpia la consola
import clear from "console-clear";
clear();

import Fastify, { FastifyInstance } from 'fastify'
import path from 'path';

import 'dotenv/config';
const { PORT, CORS_URL } = process.env;

const server: FastifyInstance = Fastify({})

// Configura y registra @fastify/cors
import cors from '@fastify/cors';
server.register(cors, {
  origin: CORS_URL || '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// graphql
import mercurius from 'mercurius'
import { schema, resolvers } from './src/graphql'

server.register(mercurius, {
  schema,
  resolvers,
  graphiql: true
})


// Configura y registra @fastify/static para servir archivos estáticos
import fastifyStatic from '@fastify/static';
server.register(fastifyStatic, {
  root: path.join(__dirname, "src", 'public'),
  prefix: '/',
});

// routers
import { healthcheck } from "./src/routers"
server.register(healthcheck, { prefix: '/' })

const start = async () => {
  try {
    server.listen({ port: Number(PORT) || 3500 })
    console.log(`Server listening on ${server.server.address()}`)

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()