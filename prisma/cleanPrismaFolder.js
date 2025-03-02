const fs = require('fs');
const path = require('path');
const { rimraf } = require('rimraf');

// Define la ruta de la carpeta prisma
const prismaFolderPath = path.resolve(__dirname, '../prisma');

// Lee el contenido de la carpeta prisma
fs.readdir(prismaFolderPath, async (err, files) => {
  if (err) {
    console.error(`Error al leer la carpeta prisma: ${err.message}`);
    return;
  }

  // Filtra los archivos para excluir schema.prisma, changeProvider.js y cleanPrismaFolder.js
  const filesToDelete = files.filter(file => file !== 'schema.prisma' && file !== 'changeProvider.js' && file !== 'cleanPrismaFolder.js');

  // Elimina cada archivo excepto schema.prisma, changeProvider.js y cleanPrismaFolder.js
  for (const file of filesToDelete) {
    const filePath = path.join(prismaFolderPath, file);
    try {
      await rimraf(filePath);
      console.log(`Archivo eliminado: ${file}`);
    } catch (err) {
      console.error(`Error al eliminar el archivo ${file}: ${err.message}`);
    }
  }
});