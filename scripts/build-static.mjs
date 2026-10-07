import { readFileSync, writeFileSync } from 'node:fs';

const source = readFileSync(new URL('../server.js', import.meta.url), 'utf8');
const start = source.indexOf('const media = {');
const end = source.indexOf('const MIME = {');
if (start < 0 || end < 0 || end <= start) throw new Error('Impossible d’extraire les données de présentation.');
const data = source.slice(start, end).trim();
const output = `// Généré depuis server.js pour le mode statique GitHub Pages.\n${data}\n\nexport { decks, common };\n`;
writeFileSync(new URL('../public/decks.js', import.meta.url), output);
console.log('public/decks.js generated');
