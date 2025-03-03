import { FastifyInstance } from 'fastify';

const healthcheck = (server: FastifyInstance) => {
    server.get('/', async (request, reply) => {
        return reply.view('healthcheck', { name: 'healthcheck' });
    });
}

export default healthcheck;