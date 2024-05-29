document.addEventListener("DOMContentLoaded", (event) => {
  GetPrices();
  GetStoredTokens();
  setInterval(GetPrices, 5000);
});

async function GetPrices() {
  const request = await fetch("http://127.0.0.1:4000/coin/price/");
  const prices = await JSON.parse(await request.text());

  if (document.querySelector(".trending-coins ul"))
    document.querySelector(".trending-coins ul").remove();

  const ul = document.createElement("ul");

  for (const token of prices) {
    ul.insertAdjacentHTML("beforeend", `<li>${token}</li>`);
  }

  document
    .querySelector(".trending-coins")
    .insertAdjacentElement("afterbegin", ul);
}

async function GetStoredTokens() {
  const request = await fetch("http://127.0.0.1:4000/coin/data/list/");
  const tokens = await request.json();

  if (document.querySelector(".stored-coins ul"))
    document.querySelector(".stored-coins ul").remove();

  const ul = document.createElement("ul");

  for (const token of tokens) {
    ul.insertAdjacentHTML(
      "beforeend",
      `<li>${token.tokenName} : ${token.tokenPublicID} <a class="delete-token" href="" data-tokenid="${token.tokenPublicID}">Delete</a> </li>`
    );
  }

  document
    .querySelector(".stored-coins")
    .insertAdjacentElement("afterbegin", ul);

  //Add eventlisteners to the links
  document
    .querySelectorAll(".delete-token")
    .forEach(async function (deleteLink) {
      deleteLink.addEventListener("click", async function (event) {
        event.preventDefault();
        console.log(event.target);
        await DeleteOneTOken({ tokenPublicID: event.target.dataset.tokenid });
      });
    });
}

//ADD a new Token
const formAddToken = document.querySelector("#add-token");
formAddToken.addEventListener("submit", async function (event) {
  event.preventDefault();
  const { target } = event;
  const payload = {
    tokenName: target.tokenName.value,
    tokenPublicID: target.tokenPublicID.value,
  };
  await SaveOneToken(payload);
  target.reset();
});

async function SaveOneToken(tokenData) {
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" }, //This can be a header object or literal string object {''}
    body: JSON.stringify(tokenData), //Convert the object to JSON to fastify validations
  };

  const request = await fetch("http://127.0.0.1:4000/coin/data/add/", opts);
  const token = await request.text();

  GetStoredTokens();
}

//DELETE A TOKEN
async function DeleteOneTOken(tokenPublicID) {
  console.log(tokenPublicID);
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" }, //This can be a header object or literal string object {''}
    body: JSON.stringify(tokenPublicID), //Convert the object to JSON to fastify validations
  };

  const request = await fetch("http://127.0.0.1:4000/coin/data/delete/", opts);
  const token = await request.text();

  GetStoredTokens();
}
