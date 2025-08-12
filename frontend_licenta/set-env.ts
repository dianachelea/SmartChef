const { writeFileSync, mkdirSync } = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: './secure.env' });

const targetPath = './src/environments/environment.ts';

mkdirSync('./src/environments', { recursive: true });

const SPOON_KEY = process.env['NG_APP_SPOONACULAR_KEY'] ?? '';
const API_BASE  = process.env['NG_APP_API_BASE_URL'] ?? '';

const envConfigFile = `export const environment = {
  production: false,
  spoonacularApiKey: '${SPOON_KEY}',
  apiBaseUrl: '${API_BASE}'
};
`;

writeFileSync(targetPath, envConfigFile, { encoding: 'utf-8' });
console.log(`Environment file generated at ${targetPath}`);
