import registerUsuario from "./sesionRegister";
import loginUsuario from "./sesionLogin";
import validarSesion from "./sesionValidarSesion";
import resetPassword from "./resetSendEmail";

const resolvers = {
    Query: {
        validarSesion
    },
    
    Mutation: {
        registerUsuario,
        loginUsuario,
        resetPassword
    }
};

export default resolvers;