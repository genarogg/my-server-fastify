import helloResolvers from "./resolvers/saludo";
import pdfResolver from "./resolvers/pdf"

const resolvers = {
    Query: {
        ...helloResolvers.Query,
        ...pdfResolver.Query
    },
};

export default resolvers;