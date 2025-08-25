import Fastify, { FastifyInstance } from 'fastify'
import Table from 'cli-table3';
import clear from "console-clear";
import colors from "colors";
import 'dotenv/config';

clear();

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
  compressFastify
} from "./src/server/config"

// viewEJS(server);
staticFiles(server);
graphql(server);
caching(server)
swagger(server);
rateLimit(server);
helmet(server);
fastifyMetrics(server);
corsFastify(server);
underPressureFastify(server);
compressFastify(server);

// routers
import { healthcheck } from "./src/server/routers"
server.register(healthcheck, { prefix: '/' })

import tack from "./src/server/tasks"

(async () => {

  try {
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