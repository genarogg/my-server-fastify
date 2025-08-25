import type { FastifyInstance } from "fastify";
import FastifyVite from "@fastify/vite";
import { resolve } from "node:path";

const vite = async (server: FastifyInstance, dev?: boolean) => {

    await server.register(FastifyVite, {
        root: resolve(process.cwd()),
        distDir: resolve(process.cwd(), 'build'),
        dev: dev || process.argv.includes('--dev'),
        spa: true,
    })

    await server.vite.ready();

    server.get('/', (req, reply) => {
        return reply.html()
    })

};

export default vite;