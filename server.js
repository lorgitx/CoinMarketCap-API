import fastifyAutoload from '@fastify/autoload';
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import mongo from '@fastify/mongodb'
import Fastify from 'fastify'

//Get the the root folder
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Inside of Fastify object you can write configuration for app
const app = Fastify({
  logger: true // Enable logger
});

//Register new AutoLoadPlugin to load all the routes inside the folder structure
app.register(fastifyAutoload, {
  dir: join(__dirname, 'routes')
})

app.register(mongo,{
  forceClose:true,
  url:"mongodb://localhost:27017/coinmarketcap"
})

// Run web server
try {
  await app.listen({ port: 3000 })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}