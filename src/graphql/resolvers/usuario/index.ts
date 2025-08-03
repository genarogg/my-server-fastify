import registerUsuario from "./register";
import loginUsuario from "./login";

const resolvers = {
    Mutation: {
        registerUsuario,
        loginUsuario
    }
};

export default resolvers;