//GET Route for individual coin route
export default async function (fastify, opts) {
  fastify.get("/price/", async function (request, reply) {
    //Array with the top 5 five coin solana by marketcap
    const topCoinsToQuery = [
      "So11111111111111111111111111111111111111112",
      "6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui",
      "5mbK36SZ7J19An8jFochhQS4of8g6BwUjbeCSxBSoWdp",
      "7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3",
      "FU1q8vJpZNUrmqsciSjp8bAKKidGsLmouB8CBdf8TKQv",
      "StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT",
      "3S8qX1MsMqRbiwKg2cQyx7nis1oHMgaCuc9c4VfvVdPN",
      "madHpjRn6bd8t78Rsy7NuSuNwWa2HU8ByPobZprHbHv",
      "5SVG3T9CNQsm2kEwzbRq6hASqh1oGfjqTtLXYUibpump",
      "4Cnk9EPnW5ixfLZatCPJjDB1PUtcRpVVgTQukm9epump"
    ];

    return coinDataByContract(topCoinsToQuery, fastify);

  });

  fastify.get("/price/:tokenId", function (request, reply) {
    const { tokenId } = request.params;
    const coinToQuery = [tokenId];

    //Promise that return the coin price from JUP
    return coinDataByContract(coinToQuery, fastify);
  });

  // GET tokenInfo Collection
  fastify.get("/data/list/", async function (request, reply) {
    const collection = fastify.mongo.db.collection("tokenInfo");
    const tokensData = await collection.find().toArray();

    return tokensData;
  });

  // POST add a token inside tokenInfo Collection
  fastify.post("/data/add/", async function (request, reply) {
    //parse the json data inside the const
    const { tokenName, tokenPublicID } = request.body;

    //Validate that are not undefined
    if (tokenPublicID && tokenName) {
      const collection = fastify.mongo.db.collection("tokenInfo");
      //Insert a document in the collection
      const result = await collection.insertOne({ tokenPublicID, tokenName });
      reply.send({ success: true, id: result.insertedId });
    } else {
      reply.send({ msg: "no token information sended" });
    }
  });

  //TODO:DELETE A STORED TOKEN
  fastify.post("/data/delete/", async function (request, reply) {
    const { tokenPublicID } = request.body;
    if (tokenPublicID) {
      const collection = fastify.mongo.db.collection("tokenInfo");
      const result = await collection.deleteOne({
        tokenPublicID: tokenPublicID,
      });
      reply.send({ success: true, id: result.deletedCount });
    } else {
      reply.send({ msg: "no token information sended" });
    }
  });
  //TODO:UPDATE A STORED TOKEN
  fastify.put("/data/update/", async function (request, reply) {
    const { tokenID, tokenName, tokenPublicID } = request.body;
    if (tokenName && tokenPublicID && tokenID) {
      console.log(request.body)
      const collection = fastify.mongo.db.collection("tokenInfo");
      const result = await collection.updateOne(
        { "_id": new fastify.mongo.ObjectId(tokenID) },
        { $set: { tokenPublicID: tokenPublicID, tokenName: tokenName } }
      );
      reply.send({ success: true, id: result });
    } else {
      reply.send({ msg: "no token information sended" });
    }
  });
}

//Fetch the coin by contract from CoinGecko
async function coinDataByContract(contractToken, fastify) {

  let dataByContract = "https://api.coingecko.com/api/v3/simple/token_price/solana?vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&contract_addresses=";
  let dataByContractQuery = dataByContract + contractToken.join(",");

  const options = {
    method: 'GET',
    headers: { accept: 'application/json', 'x-cg-demo-api-key': process.env.COINGECKO_KEY }
  };

  //Fetch to CoinGecko
  return fetch(dataByContractQuery, options).then(res => res.json())
    .then(json => {

      const collection = fastify.mongo.db.collection("tokenInfo");
      const promises = [];

      for (const key in json) {
        if (json.hasOwnProperty(key)) {

          const queryPromise = collection.find({ tokenPublicID: key }).toArray().
            then(result => {

              json[key].name = result[0].tokenName;
            });

          promises.push(queryPromise);
        }
      }
      return Promise.all(promises)
        .then(() => {

          const entries = Object.entries(json);
          entries.sort((a, b) => b[1].usd_market_cap - a[1].usd_market_cap);
          const sortJSON = Object.fromEntries(entries);
          return sortJSON;

        })
        .then((sortJSON) => sortJSON);
    })
    .catch(err => console.error(err));
}
