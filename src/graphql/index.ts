// Define tu esquema GraphQL
const schema = `
  type Query {
    hello: String
  }
`;

// Define tus resolvers
const resolvers = {
    Query: {
        hello: async () => 'Hello world!'
    }
};

export {
    schema,
    resolvers
}