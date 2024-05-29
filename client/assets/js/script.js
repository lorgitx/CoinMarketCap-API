const APPCONFIG = {
  "API":"http://127.0.0.1:4000"
}

document.addEventListener("DOMContentLoaded", (event) => {
  GetPrices();
  GetStoredTokens();
  setInterval(GetPrices, 20000);
});

async function GetPrices() {
  const request = await fetch(APPCONFIG.API+"/coin/price/");
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
  const request = await fetch(APPCONFIG.API+"/coin/data/list/");
  const tokens = await request.json();

  if (document.querySelector(".stored-coins ul"))
    document.querySelector(".stored-coins ul").remove();

  const ul = document.createElement("ul");

  for (const token of tokens) {
    ul.insertAdjacentHTML(
      "beforeend",
      `<li >${token.tokenName} : ${token.tokenPublicID} | <a class="delete-token" href="" data-tokenid="${token.tokenPublicID}">Delete</a> | <a class="edit-token" href="" data-tokenid="${token.tokenPublicID}" data-tokenname="${token.tokenName}">Edit</a> </li>`
    );
  }

  document
    .querySelector(".stored-coins")
    .insertAdjacentElement("afterbegin", ul);

  //Add eventlisteners to the delete links
  document
    .querySelectorAll(".delete-token")
    .forEach(async function (deleteLink) {
      deleteLink.addEventListener("click", async function (event) {
        event.preventDefault();

        await DeleteOneTOken({ tokenPublicID: event.target.dataset.tokenid });
      });
    });
  //Add eventlisteners to the edit links
  document.querySelectorAll(".edit-token").forEach(async function (editLink) {
    editLink.addEventListener("click", async function (event) {
      event.preventDefault();
      await CreateInlineUpdateForm(
        { tokenPublicID: event.target.dataset.tokeid },
        event.target
      );
    });
  });
}

//Add a eventlistgener to the form 'Add a new token'
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

//Add a new token
async function SaveOneToken(tokenData) {
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" }, //This can be a header object or literal string object {''}
    body: JSON.stringify(tokenData), //Convert the object to JSON to fastify validations
  };

  const request = await fetch(APPCONFIG.API+"/coin/data/add/", opts);
  const token = await request.text();

  GetPrices();
  GetStoredTokens();
}

//Delete a token
async function DeleteOneTOken(tokenPublicID) {
  console.log(tokenPublicID);
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" }, //This can be a header object or literal string object {''}
    body: JSON.stringify(tokenPublicID), //Convert the object to JSON to fastify validations
  };

  const request = await fetch(APPCONFIG.API+"/coin/data/delete/", opts);
  const token = await request.text();

  GetStoredTokens();
}

//Place inline update form
async function CreateInlineUpdateForm(tokenPublicID, target) {
  //Update form
  const inlineForm = document.createElement("form");
  inlineForm.classList.add("inline-form");

  //form unputs
  const inputTokenName = document.createElement("input");
  inputTokenName.type = "text";
  inputTokenName.name = "tokenName";
  inputTokenName.value = target.dataset.tokenname;

  const inputTokenPublicID = document.createElement("input");
  inputTokenPublicID.type = "text";
  inputTokenPublicID.name = "tokenPublicID";
  inputTokenPublicID.value = target.dataset.tokenid;

  const updateSubmit = document.createElement("input");
  updateSubmit.type = "submit";

  inlineForm.appendChild(inputTokenName);
  inlineForm.appendChild(inputTokenPublicID);
  inlineForm.appendChild(updateSubmit);

  target.insertAdjacentElement("afterEnd", inlineForm);

  inlineForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const payload = {
      tokenName: inputTokenName.value,
      tokenPublicID: inputTokenPublicID.value,
    };
    await UpdateOneToken(payload);
  });
}

async function UpdateOneToken(tokenData) {
  console.log(tokenData);
  const opts = {
    method: "PUT",
    headers: { "Content-Type": "application/json" }, //This can be a header object or literal string object {''}
    body: JSON.stringify(tokenData), //Convert the object to JSON to fastify validations
  };

  const request = await fetch(APPCONFIG.API+"/coin/data/update/", opts);
  const token = await request.text();

  GetStoredTokens();
  GetPrices();
}
