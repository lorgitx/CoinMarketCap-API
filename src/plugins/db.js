import fp from "fastify-plugin";
import mongo from "@fastify/mongodb";

//DB Connector
async function dbConnector(fastify, opts) {
  fastify.register(mongo, {
    forceClose: true,
    url: "mongodb://localhost:27017/coinmarketcap",
  });
}

//Export the plugin and enable to anothers Fastify plugins use it
export default fp(dbConnector);
