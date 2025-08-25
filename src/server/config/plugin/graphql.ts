import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ApolloServer } from "@apollo/server";
import { fastifyApolloHandler } from "@as-integrations/fastify";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import depthLimit from "graphql-depth-limit";
import { processRequest } from "graphql-upload-minimal";
import { schema, resolvers } from "../../graphql";

declare module "fastify" {
    interface FastifyRequest {
        user?: any;
    }
}

interface GraphQLContext {
    req: FastifyRequest;
    user?: any;
}

const createApolloServer = (server: FastifyInstance) => {
    return new ApolloServer({
        typeDefs: schema, 
        resolvers, 
        introspection: true,
        csrfPrevention: false,
        validationRules: [depthLimit(10)],
        plugins: [
            ApolloServerPluginLandingPageLocalDefault({ embed: true }),
            ApolloServerPluginDrainHttpServer({ httpServer: server.server }),
        ],

        formatError: (formattedError, error) => {

            console.error("GraphQL Error:", error);

            if (process.env.NODE_ENV === "development") {
                return formattedError;
            }

            return {
                message: formattedError.message,
                code: formattedError.extensions?.code,
                path: formattedError.path,
            };
        },
    });
};

const apolloFastify = async (server: FastifyInstance) => {

    const apollo = createApolloServer(server);

    // Inicializar Apollo Server
    await apollo.start();

    // Registrar hook para procesar multipart/form-data (file uploads)
    server.addHook(
        "preHandler",
        async (request: FastifyRequest, reply: FastifyReply) => {
            if (request.url === "/graphql" || request.url.startsWith("/graphql?")) {
                if (
                    request.method === "POST" &&
                    request.headers["content-type"] &&
                    request.headers["content-type"].includes("multipart/form-data")
                ) {
                    try {
                        // Procesar upload de archivos usando casting seguro
                        (request as any).body = await processRequest(
                            request.raw,
                            reply.raw
                        );
                    } catch (error: any) {
                        server.log.error("Error processing file upload:", error);
                        await reply.code(400).send({
                            error: "Error processing file upload",
                            details:
                                process.env.NODE_ENV === "development"
                                    ? error instanceof Error
                                        ? error.message
                                        : String(error)
                                    : undefined,
                        });
                        return;
                    }
                }
            }
        }
    );

    // Registrar la ruta de GraphQL
    server.route({
        url: "/graphql",
        method: ["GET", "POST", "OPTIONS"],
        handler: fastifyApolloHandler(apollo, {
            context: async (request: FastifyRequest): Promise<GraphQLContext> => {
                return {
                    req: request,
                    user: request.user || null,
                };
            },
        }),
    });

    // Agregar ruta de salud para GraphQL
    server.route({
        method: "GET",
        url: "/graphql/health",
        handler: async () => {
            return {
                status: "ok",
                service: "graphql",
                timestamp: new Date().toISOString(),
            };
        },
    });

    server.log.info("Apollo GraphQL server configured successfully");
    return server;
};

export default apolloFastify;
