import registerUsuario from "./register";
import loginUsuario from "./login";
import validarSesion from "./validarSesion";

const resolvers = {
    Query: {
        validarSesion
    },
    
    Mutation: {
        registerUsuario,
        loginUsuario,
    }
};

export default resolvers;