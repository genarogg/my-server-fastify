// Limpia la consola
import clear from "console-clear";
clear();

import Fastify, { FastifyInstance } from 'fastify'

import Table from 'cli-table3';
import colors from "colors";

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


// Configurar metrics
import fastifyMetrics from 'fastify-metrics';
server.register(fastifyMetrics, {
  endpoint: '/metrics'
});

import {
  dbConection,
  viewEJS,
  staticFiles,
  graphql,
  caching,
  swagger,
  helmet,
  rateLimit
} from "./src/config"


viewEJS(server);
staticFiles(server);
graphql(server);
caching(server)
swagger(server);
rateLimit(server);
helmet(server);

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
    let dbStatus = await dbConection() || "";
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