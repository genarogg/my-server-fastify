import path from 'path';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const swagger = (server: any) => {
    server.register(fastifySwagger, {
        mode: 'static',
        specification: {
            path: path.join(process.cwd(), 'public', 'docs', 'swagger.yaml'),
            baseDir: process.cwd(),
        },
    });
    server.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        staticCSP: true,
        transformStaticCSP: (header: any) => header,
    });
}

export default swagger;