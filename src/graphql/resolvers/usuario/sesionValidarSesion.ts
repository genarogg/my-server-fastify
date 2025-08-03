import { verificarToken, successResponse, errorResponse } from '@fn';

interface validarSesionArgs {
    token: string;
}

const validarSesion = async (_: unknown, { token }: validarSesionArgs) => {
    try {
        const { id, name, email } = await verificarToken(token);

        console.log("ID:", id, "Name:", name, "Email:", email);

        if (!id) {
            return errorResponse({ message: 'Token inválido o expirado' });
        }

        return successResponse({
            message: 'Token verificado exitosamente',
            data: { id, name, email, token }
        });

    } catch (error: any) {
        return errorResponse({ message: error.message });
    }
};

export default validarSesion;