import Fastify from 'fastify'

// Inside of Fastify object you can write configuration for app
const fastify = Fastify({
  logger: true // Enable logger
});



// Run web server
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}