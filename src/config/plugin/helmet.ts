import helmet from '@fastify/helmet';



const helmetSecure = (server: any) => {

    return server.register(helmet, {
        global: true,
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        frameguard: { action: 'deny' },
        hidePoweredBy: true,
    });

}

export default helmetSecure;