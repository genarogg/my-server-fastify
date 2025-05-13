// scripts/add-js-ext.js
import { promises as fs } from 'fs';
import path from 'path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');

async function walk(dir) {
  for (const name of await fs.readdir(dir)) {
    const p = path.join(dir, name);
    const stat = await fs.stat(p);
    if (stat.isDirectory()) {
      await walk(p);
    } else if (p.endsWith('.js')) {
      let content = await fs.readFile(p, 'utf8');
      // Regex que busca: import ... from '.../algo' (sin .js ni /)
      content = content.replace(
        /from\s+(['"])(\.[^'"]+?)(['"])/g,
        (_all, quote1, imp, quote2) => {
          // ignora imports a node_modules (/^[./]/ solo procesar relativos)
          if (imp.endsWith('.js') || imp.endsWith('/')) return `from ${quote1}${imp}${quote2}`;
          return `from ${quote1}${imp}.js${quote2}`;
        }
      );
      await fs.writeFile(p, content, 'utf8');
    }
  }
}

walk(DIST_DIR)
  .then(() => console.log('✅ Extensiones .js añadidas en dist/'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
