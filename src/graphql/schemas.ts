const schemas = /* GraphQL */ `

##############################################
# Tipos básicos
##############################################
# Tipo para el modelo Usuario


##############################################
# Tipos de response
##############################################


##############################################
# Tipos de entrada
##############################################

input PDFDataInput {
  data: String!
}

##############################################
# Scalar
##############################################
scalar Upload
scalar Date

##############################################
# Query y Mutation
##############################################

type Query {
  hello: String
  generatePDF(template: String!, data: PDFDataInput!): String  
}

`;

export default schemas;