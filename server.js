import fastifyAutoload from '@fastify/autoload';
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Fastify from 'fastify'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Inside of Fastify object you can write configuration for app
const app = Fastify({
  logger: true // Enable logger
});

app.register(fastifyAutoload, {
  dir: join(__dirname, 'routes')
})


// Run web server
try {
  await app.listen({ port: 3000 })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}