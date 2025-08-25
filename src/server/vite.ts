import type { FastifyInstance } from "fastify";
import FastifyVite from "@fastify/vite";
import { resolve } from "node:path";

const vite = async (server: FastifyInstance, dev?: boolean) => {

    await server.register(FastifyVite, {
        root: resolve(process.cwd(), "src"),
        distDir: resolve(process.cwd(), "src", "client", 'build'),
        dev: dev || process.argv.includes('--dev'),
        spa: true,
    })
await server.vite.ready();

};

export default vite;