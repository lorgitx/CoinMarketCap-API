document.addEventListener("DOMContentLoaded", (event) => {
  async function GetPrices() {
    const request = await fetch("http://127.0.0.1:4000/coin/price/");
    const prices = await JSON.parse(await request.text());

    if (document.querySelector("ul")) document.querySelector("ul").remove();

    const ul = document.createElement("ul");

    for (const token of prices) {
      ul.insertAdjacentHTML("beforeend", `<li>${token}</li>`);
    }

    document.querySelector("h1").insertAdjacentElement("afterend", ul);
  }

  GetPrices();

  setInterval(GetPrices, 5000);
});
