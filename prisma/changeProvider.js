const fs = require('fs');
const path = require('path');

// Lee el archivo .env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');
const schema = fs.readFileSync(schemaPath, 'utf-8');

// Detecta el proveedor de base de datos a partir de DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
let provider;

if (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) {
  provider = 'postgresql';
} else if (databaseUrl.startsWith('mysql://')) {
  provider = 'mysql';
} else if (databaseUrl.startsWith('sqlite://') || databaseUrl.startsWith('file:')) {
  provider = 'sqlite';
} else if (databaseUrl.startsWith('sqlserver://')) {
  provider = 'sqlserver';
} else if (databaseUrl.startsWith('mongodb://')) {
  provider = 'mongodb';
} else {
  throw new Error('Proveedor de base de datos no soportado');
}

// Reemplaza el proveedor en el bloque datasource db
const newSchema = schema.replace(/datasource db\s*{\s*provider\s*=\s*".*"/, `datasource db {\n  provider = "${provider}"`);

fs.writeFileSync(schemaPath, newSchema);
console.log(`Prisma schema updated with provider: ${provider}`);