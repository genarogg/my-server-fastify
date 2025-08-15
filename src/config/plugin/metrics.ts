import type { FastifyInstance } from "fastify"
import fastifyMetrics from 'fastify-metrics';

const metrics = (server: FastifyInstance) => {

    return server.register(fastifyMetrics, {
        endpoint: '/metrics'
    });



}

export default metrics;