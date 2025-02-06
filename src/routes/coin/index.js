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
