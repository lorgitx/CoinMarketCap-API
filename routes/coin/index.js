//GET Route for individual coin route
export default async function (fastify, opts) {

  fastify.get("/", async function (request, reply) {

    //Array with the top 5 five coin solana by marketcap
    const topCoinsToQuery = [
      'So11111111111111111111111111111111111111112',
      '6D7NaB2xsLd7cauWu1wKk6KBsJohJmP2qZH9GEfVi5Ui',
      '5mbK36SZ7J19An8jFochhQS4of8g6BwUjbeCSxBSoWdp',
      '7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3',
      'FU1q8vJpZNUrmqsciSjp8bAKKidGsLmouB8CBdf8TKQv'
    ]

    return jupPriceApi(topCoinsToQuery)
  });
  
  fastify.get("/:tokenId", function (request, reply) {
    const { tokenId } = request.params
    const coinToQuery = [tokenId]

    //Promise that return the coin price from JUP
    return jupPriceApi(coinToQuery);
  });
}

//Fetch the coin price with tokenId on Solana
function jupPriceApi(tokenId) {

  var jupAPI = "https://price.jup.ag/v4/price?ids=" 
  tokenId.forEach((element) => {jupAPI =jupAPI+','+element})  

  // Fetch to  JUP API
  var finalCoinPrice = fetch(jupAPI)
    .then((response) => response.json())

    .then((responseJSON) => {

      const coin = responseJSON.data;

      console.log(coin) 

      var coinPrice = [];
      const keys = Object.keys(coin);

      keys.forEach((key) => {
        coinPrice.push(coin[key].id+':'+coin[key].price);
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