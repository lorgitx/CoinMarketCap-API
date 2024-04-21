export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return 'This are the five coin by marketcap'
  })
  fastify.get('/:tokenId',async function (request,reply){
    const {tokenId} = request.params
    return tokenId;
  })
}
