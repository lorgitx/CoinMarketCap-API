//GET Route for individual coin route
export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    return "This are the five coin by marketcap";
  });
  fastify.get("/:tokenId", function (request, reply) {
    const { tokenId } = request.params;

    //Promise that return the coin price from JUP
    return jupPriceApi(tokenId);
  });
}

//Fetch the coin price with tokenId on Solana
function jupPriceApi(tokenId) {

  const jupAPI = "https://price.jup.ag/v4/price?ids=" + tokenId;

  // Fetch to  JUP API
  var finalCoinPrice = fetch(jupAPI)
    .then((response) => response.json())

    .then((data) => {
      const coin = data.data;
      var coinPrice;

      const keys = Object.keys(coin);

      keys.forEach((key) => {
        coinPrice = coin[key].price;
      });

      return coinPrice;
    })

    .catch((err) => {
      // Error handler
      console.error("Error al realizar la solicitud:", error);
      return err;
    });

  return finalCoinPrice;
}
