import { config } from 'dotenv';

const isProduction = process.env.VERCEL_ENV === 'production';
const isPreview = process.env.VERCEL_ENV === 'preview';

if (!isProduction && !isPreview) {
  console.log('Loading custom .env');
  config({ path: '.env.dev' });
} else {
  console.log('Using Vercel .env');
}

import { fileURLToPath } from "url";
import { dirname, join } from "path";

import Fastify from "fastify";

import fastifyAutoload from "@fastify/autoload";

// import fastifyCors from '@fastify/cors';

// //Get the the root folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inside of Fastify object you can write configuration for app
const app = Fastify({
  logger: true, // Enable logger
});

// // Registrar el plugin CORS
// app.register(fastifyCors, {
//   origin: '*',  // Puedes especificar un dominio específico en lugar de '*'
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
// });

// Autoload pLugins and routes
app.register(fastifyAutoload, {
  dir: join(__dirname, "src"),
  dirNameRoutePrefix: function rewrite(folderParent, folderName) {
    if (folderName === "coin") {
      return folderName;
    }
    return false;
  },
});

app.addHook('preParsing', (request, reply, payload, done) => {
  // Si la URL empieza con "/api", la modificamos quitándole ese prefijo
  if (request.raw.url.startsWith('/api')) {
    request.raw.url = request.raw.url.slice(4); // quita los primeros 4 caracteres: "/api"
  }
  done(null, payload);
});


export default async (req, res) => {
  // Run web server
  try {
    await app.ready();
    app.server.emit('request', req, res);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
} 
