import fastifyCaching from '@fastify/caching';

const caching = (server: any) => {

    return server.register(fastifyCaching, {
        privacy: fastifyCaching.privacy.PUBLIC,
        expiresIn: 3600
    });

}

export default caching;