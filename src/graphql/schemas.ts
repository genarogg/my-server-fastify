const schemas = /* GraphQL */ `

##############################################
# Tipos básicos
##############################################

type Usuario {
  id: Int!
  name: String!
  email: String!
  rol: Rol!
  token: String!
}

##############################################
# Tipos de response
##############################################

type UsuarioResponse {
  type: String
  message: String
  data: Usuario
}

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

type Mutation {
  registerUsuario(
    token: String
    name: String!
    email: String!
    password: String!
    captchaToken: String
    rol: Rol
  ): UsuarioResponse!
  loginUsuario(
    email: String!, 
    password: String!, 
    captchaToken: String
    ): UsuarioResponse!
}
`;

export default schemas;
