import Fastify from 'fastify'

// Inside of Fastify object you can write configuration for app
const fastify = Fastify({
  logger: true // Enable logger
});

// Create a routes for homepage and about
fastify.get('/', async function handler (request, reply) {
  return { some_variable: 'some value of variable' }
});

fastify.get('/about', async function handler (request, reply) {
  return { info: 'Super puper information is saved here' }
});

// Run web server
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}