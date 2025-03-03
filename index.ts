// Limpia la consola
import clear from "console-clear";
clear();

import Fastify, { FastifyInstance } from 'fastify'
import path from 'path';
import Table from 'cli-table3';
import colors from "colors";

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
  global: true,
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
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

// Configurar slow down
import slowDown from 'fastify-slow-down';
server.register(slowDown, {
  delayAfter: 50,
  delay: 500
});

// Configurar compresión
import compress from '@fastify/compress';
server.register(compress, { global: true });

// Configurar caching
import fastifyCaching from '@fastify/caching';
server.register(fastifyCaching, {
  privacy: fastifyCaching.privacy.PUBLIC,
  expiresIn: 3600
});

// Configurar Swagger
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

server.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'API documentacion',
      description: 'API documentacion for my project',
      version: '1.0.0'
    },
    host: 'localhost:' + Number(PORT),
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
});

server.register(fastifySwaggerUi, {
  routePrefix: '/documentacion',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  staticCSP: true,
  transformStaticCSP: (header) => header
});

// Configurar metrics
import fastifyMetrics from 'fastify-metrics';
server.register(fastifyMetrics, {
  endpoint: '/metrics'
});

// db conection
import dbConection from "./src/config/db-conection";
let dbStatus: any;

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
  cacheControl: true,
  maxAge: 86400000,
  etag: true
});

// Configurar Next.js
import next from '@fastify/nextjs';
server.register(next, { dev: process.env.NODE_ENV !== 'production' });

server.after(() => {
  server.next('/hello');
});


import fastifyView from '@fastify/view';
import ejs from 'ejs';

server.register(fastifyView, {
  engine: {
    ejs
  },
  root: path.join(__dirname, 'src', 'views'),
  viewExt: 'ejs',
});

// routers
import { healthcheck } from "./src/routers"
server.register(healthcheck, { prefix: '/' })

const start = async () => {
  try {
    const port = Number(PORT) || 3500
    dbStatus = await dbConection();
    server.listen({ port })

    const table = new Table({
      head: ['Servicio', 'URL'],
      colWidths: [20, 50]
    });

    table.push(
      ['Servidor', colors.green(`http://localhost:${PORT}`)],
      ['Graphql', colors.green(`http://localhost:${PORT}/graphiql`)],
      ['Documentacion', colors.cyan(`http://localhost:${PORT}/documentacion`)],
      ['Metrics', colors.cyan(`http://localhost:${PORT}/metrics`)],
      ["db estatus", colors.cyan(dbStatus)]
    );

    // Imprimir la tabla
    console.log(table.toString());
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()