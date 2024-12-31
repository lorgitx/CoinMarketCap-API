import { fileURLToPath } from "url";
import { dirname, join } from "path";

import Fastify from "fastify";
import fastifyAutoload from "@fastify/autoload";

import fastifyCors from '@fastify/cors';

//Get the the root folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Inside of Fastify object you can write configuration for app
const app = Fastify({
  logger: true, // Enable logger
});

// Registrar el plugin CORS
app.register(fastifyCors, {
  origin: '*',  // Puedes especificar un dominio específico en lugar de '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
});

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

// Run web server
try {
  await app.listen({ port: 4000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}