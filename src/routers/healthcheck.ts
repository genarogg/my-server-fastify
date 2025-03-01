import { FastifyInstance } from 'fastify';

const healthcheck = (server: FastifyInstance) => {
    server.get('/', async (request, reply) => {
        return { user: 'profile data' };
    });
}

export default healthcheck;