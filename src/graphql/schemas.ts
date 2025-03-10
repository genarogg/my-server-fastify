const schemas = /* GraphQL */ `

  ##############################################
  # Tipos básicos
  ##############################################
  
 

  ##############################################
  # Tipos de entrada
  ##############################################
  
  input PDFDataInput {
    message: String!
    items: [String!]!
  }

  ##############################################
  # Query y Mutation
  ##############################################
  
  type Query {
    hello: String
    generatePDF(template: String!, data: PDFDataInput!): String
  }

`;

export default schemas;