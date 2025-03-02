import { FastifyInstance } from 'fastify';

const pdf = (server: FastifyInstance) => {
    server.get('/pg', async (request, reply) => {
        return reply.view("pdf/pg");
    });
}

export default pdf;