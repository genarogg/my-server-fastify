import Fastify, { FastifyInstance } from 'fastify'
import Table from 'cli-table3';
import clear from "console-clear";
import colors from "colors";
import 'dotenv/config';


const { PORT } = process.env;
const server: FastifyInstance = Fastify({})

import {
  dbConection,
  viewEJS,
  staticFiles,
  graphql,
  caching,
  swagger,
  helmet,
  rateLimit,
  fastifyMetrics,
  underPressureFastify,
  corsFastify,
  compressFastify,
  reactView
} from "./src/server/config"

const registerPlugins = async () => {
  await viewEJS(server);
  await staticFiles(server);
  graphql(server);
  await caching(server)
  swagger(server);
  await rateLimit(server);
  await helmet(server);
  await fastifyMetrics(server);
  await corsFastify(server);
  await underPressureFastify(server);
  await compressFastify(server);
  await reactView(server);
}

// routers
import { healthcheck } from "./src/server/routers"
server.register(healthcheck, { prefix: '/estadisticas' })

import tack from "./src/server/tasks"

(async () => {
  clear();
  try {
    await registerPlugins()
    const port = Number(PORT) || 3500
    const dbStatus = await dbConection() || "";
    await server.listen({ port, host: '0.0.0.0' });

    const table = new Table({
      head: ['Servicio', 'URL'],
      colWidths: [20, 50]
    });

    /* ejecutar tareas programadas */
    tack()

    table.push(
      ['Servidor', colors.green(`http://localhost:${PORT}`)],
      ['Graphql', colors.green(`http://localhost:${PORT}/graphql`)],
      ['Documentacion', colors.cyan(`http://localhost:${PORT}/docs`)],
      ["db estatus", colors.cyan(dbStatus)]
    );

    console.log(table.toString());
  } catch (err) {
    console.log(err)
  }
})();

export default server;