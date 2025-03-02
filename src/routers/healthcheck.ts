import { FastifyInstance } from 'fastify';

const healthcheck = (server: FastifyInstance) => {
    server.get('/', async (request, reply) => {
        return { healthcheck: 'ok' };
    });
}

export default healthcheck;