// Limpia la consola
import clear from "console-clear";
clear();

import Fastify, { FastifyInstance } from 'fastify'
import path from 'path';
import Table from 'cli-table3';
import colors from "colors";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import 'dotenv/config';
const { PORT } = process.env;

const server: FastifyInstance = Fastify({})

// Configura y registra @fastify/cors
import cors from '@fastify/cors';
server.register(cors, {
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// configurar helmet
import helmet from '@fastify/helmet';
server.register(helmet, {
  global: true,
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
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

import underPressure from '@fastify/under-pressure';

server.register(underPressure, {
  maxEventLoopDelay: 1500,
  message: 'Under pressure!',
  retryAfter: 50
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
  mode: 'static',
  specification: {
    path: path.join(process.cwd(), 'public', 'docs', 'swagger.yaml'),
    baseDir: process.cwd(),
  },
});

server.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

// Configurar metrics
import fastifyMetrics from 'fastify-metrics';
server.register(fastifyMetrics, {
  endpoint: '/metrics'
});

// db conection
import dbConection from "./src/config/db-conection";
let dbStatus: any;


// Registrar @fastify/express



import { viewEJS, staticFiles } from "./src/config"
viewEJS(server);
staticFiles(server);


// servir archivos estáticos



// routers
import { healthcheck } from "./src/routers"
server.register(healthcheck, { prefix: '/' })


import tack from "./src/tasks"
import seed from "src/send";

const start = async () => {

  if (process.env.IS_SERVERLESS) {
    return
  }

  try {
    const port = Number(PORT) || 3500
    dbStatus = await dbConection();
    await server.listen({ port, host: '0.0.0.0' });

    const table = new Table({
      head: ['Servicio', 'URL'],
      colWidths: [20, 50]
    });

    /* ejecutar tareas programadas */
    tack()
    seed()

    table.push(
      ['Servidor', colors.green(`http://localhost:${PORT}`)],
      ['Graphql', colors.green(`http://localhost:${PORT}/graphql`)],
      ['Documentacion', colors.cyan(`http://localhost:${PORT}/docs`)],
      ["db estatus", colors.cyan(dbStatus)]
    );

    // Imprimir la tabla
    console.log(table.toString());
  } catch (err) {
    server.log.error(err)
    console.log(err)
    process.exit(1)
  }
}

start()

export default server;