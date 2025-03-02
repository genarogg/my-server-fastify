// Limpia la consola
import clear from "console-clear";
clear();

import Fastify, { FastifyInstance } from 'fastify'
import path from 'path';
import { log } from "@fn"

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

//configurar helmet
import helmet from '@fastify/helmet';
server.register(helmet, {
  contentSecurityPolicy: false,
});

// Configura  @fastify/rate-limit
import rateLimit from '@fastify/rate-limit';
server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: (req, context) => {
    return {
      code: 429,
      error: 'Too Many Requests',
      message: 'Has alcanzado el límite de solicitudes. Por favor, inténtalo de nuevo más tarde.'
    }
  }
});


// Configurar Swagger
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

server.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'API Documentation',
      description: 'API documentation for my project',
      version: '1.0.0'
    },
    host: 'localhost:4000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
});

server.register(fastifySwaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  staticCSP: true,
  transformStaticCSP: (header) => header
});

// graphql
import mercurius from 'mercurius'
import { schema, resolvers } from './src/graphql'

server.register(mercurius, {
  schema,
  resolvers,
  graphiql: true
})


// servir archivos estáticos
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

    const port = Number(PORT) || 3500

    server.listen({ port })
    log.success(`El servidor esta corriendo en http://localhost:${PORT}`);
    log.info(`Graphql esta corriendo en http://localhost:${PORT}/graphiql`);
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()