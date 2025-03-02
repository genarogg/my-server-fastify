import { PrismaClient } from '@prisma/client';
import { log } from "@fn";

const dbConection = async () => {
    const prisma = new PrismaClient();

    try {
        await prisma.$connect();
        log.info("db conectada!");
    } catch (error: any) {
        log.error(`Error al conectar a la db: ${error.message}`);
    }

    process.on('SIGINT', async () => {
        await prisma.$disconnect();
        log.info("db desconectada!");
        process.exit(0);
    });
}

export default dbConection;