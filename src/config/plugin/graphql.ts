import fastifyExpress from '@fastify/express';
import express from 'express';
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import bodyParser from "body-parser";
import { processRequest } from "graphql-upload-minimal";
import depthLimit from "graphql-depth-limit";
import { schema, resolvers } from "../../graphql";

const graphql = (server: any) => {

    return server.register(fastifyExpress).after(() => {
        const app = express();

        const apolloServer = new ApolloServer({
            typeDefs: schema,
            resolvers,
            introspection: true,
            csrfPrevention: false,
            validationRules: [
                depthLimit(10) 
            ],
            plugins: [
                ApolloServerPluginLandingPageLocalDefault({ embed: true })
            ],
        });

        apolloServer.start().then(() => {
            app.use(
                "/graphql",
                async (req, res, next) => {
                    if (
                        req.method === "POST" &&
                        req.headers["content-type"] &&
                        req.headers["content-type"].includes("multipart/form-data")
                    ) {
                        try {
                            req.body = await processRequest(req, res);
                        } catch (error) {
                            return next(error);
                        }
                    }
                    next();
                },
                bodyParser.json(),
                expressMiddleware(apolloServer)
            );

            server.use(app);
        });
    });

}

export default graphql;