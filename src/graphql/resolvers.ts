import demoResolvers from "./resolvers/demo";
import pdfResolverResolvers from "./resolvers/pdf"

const resolvers = {
    Query: {
        ...demoResolvers.Query,
        ...pdfResolverResolvers.Query,
    },
};

export default resolvers;