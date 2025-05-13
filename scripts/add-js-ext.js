// scripts/add-js-ext.js
import { promises as fs, existsSync, statSync } from 'fs';
import path from 'path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');

async function walk(dir) {
  for (const name of await fs.readdir(dir)) {
    const p = path.join(dir, name);
    const stat = await fs.stat(p);
    if (stat.isDirectory()) {
      await walk(p);
    } else if (p.endsWith('.js')) {
      const fileDir = path.dirname(p);
      let content = await fs.readFile(p, 'utf8');
      content = content.replace(
        /from\s+(['"])(\.[^'"]+?)(['"])/g,
        (_all, quote1, imp, quote2) => {
          if (!imp.startsWith('.')) return _all;

          const absBase = path.resolve(fileDir, imp);
          const filePath = absBase + '.js';
          const dirPath = absBase;

          // 1) Si existe archivo .js, se prioriza
          if (existsSync(filePath) && statSync(filePath).isFile()) {
            return `from ${quote1}${imp}.js${quote2}`;
          }
          // 2) Si existe carpeta con index.js
          if (existsSync(dirPath) && statSync(dirPath).isDirectory() && existsSync(path.join(dirPath, 'index.js'))) {
            return `from ${quote1}${imp}/index.js${quote2}`;
          }
          // 3) Ya termina en .js o slash, lo dejamos igual
          if (imp.endsWith('.js') || imp.endsWith('/')) {
            return `from ${quote1}${imp}${quote2}`;
          }
          // 4) Por defecto agregamos .js
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
