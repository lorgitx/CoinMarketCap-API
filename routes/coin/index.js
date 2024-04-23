import axios from 'axios'

export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return 'This are the five coin by marketcap'
  })
  fastify.get('/:tokenId',  function (request, reply) {
    const { tokenId } = request.params

    const tokenIdPrice =  jupPriceApi(tokenId)
console.log(22)
    return tokenIdPrice
  })
}


 function jupPriceApi(tokenId) {

  const jupAPI = 'https://price.jup.ag/v4/price?ids=' + tokenId

  // Realizar una solicitud GET utilizando Axios
  var finalCoinPrice = axios.get(jupAPI)
    .then(response => {
      console.log(33)
      const coin = response.data.data
      var coinPrice;

      const keys = Object.keys(coin);

      keys.forEach(key => {
        coinPrice = coin[key].price
      })
      //console.log(coinPrice)
      return coinPrice
    })
    .catch(error => {
      // Manejar errores de la solicitud
      console.error('Error al realizar la solicitud:', error);
      return error
    });

    console.log(44)

  return finalCoinPrice
}