import fp from 'fastify-plugin'
import mongo from '@fastify/mongodb'

async function dbConnector(fastify,opts){
    fastify.register(mongo,{
        forceClose:true,
        url:"mongodb://localhost:27017/coinmarketcap"
      })
}

export default fp(dbConnector)