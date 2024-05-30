const APPCONFIG = {
  API: "http://127.0.0.1:4000",
};

//Execute when the DOM is loaded
document.addEventListener("DOMContentLoaded", (event) => {
  GetPrices();
  GetStoredTokens();
  setInterval(GetPrices, 20000);
});

//Get prices list
async function GetPrices() {
  const request = await fetch(APPCONFIG.API + "/coin/price/");
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

//Load Stored Token Components
async function GetStoredTokens() {
  const request = await fetch(APPCONFIG.API + "/coin/data/list/");
  const tokens = await request.json();

  console.log("init", tokens);

  if (tokens.length != 0) {
    if (document.querySelector(".stored-coins ul")) {
      document.querySelector(".stored-coins ul").remove();
    }
    if (document.querySelector(".stored-coins h3")) {
      document.querySelector(".stored-coins h3").remove();
    }

    if (document.querySelector(".stored-coins >a")) {
      document.querySelector(".stored-coins >a").remove();
    }

    const ul = document.createElement("ul");

    for (const token of tokens) {
      ul.insertAdjacentHTML(
        "beforeend",
        `<li >${token.tokenName} : ${token.tokenPublicID} | <a class="delete-token" href="" data-tokenid="${token.tokenPublicID}">Delete</a> | <a class="edit-token" href="" data-tokenpublicid="${token.tokenPublicID}" data-tokenid="${token._id}" data-tokenname="${token.tokenName}">Edit</a> </li>`
      );
    }

    document
      .querySelector(".stored-coins")
      .insertAdjacentElement("afterbegin", ul);

    //Add a 'Add a new token' button
    const addNewTokenButton = document.createElement("a");
    addNewTokenButton.text = "Add token";
    addNewTokenButton.href = "#";

    addNewTokenButton.addEventListener("click", function (event) {
      event.preventDefault();
      document.querySelector("#add-token").classList.remove("hidden");
      document.querySelector("#add-token").classList.add("visible");
    });

    document
      .querySelector(".stored-coins")
      .insertAdjacentElement("beforeend", addNewTokenButton);

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

        if (
          event.target.nextSibling &&
          event.target.nextSibling.tagName === "FORM"
        ) {
        } else {
          if (document.querySelector(".inline-form"))
            document.querySelector(".inline-form").remove();

          //add inline update form

          const target = event.target;

          const inlineForm = document.createElement("form");
          inlineForm.classList.add("inline-form");

          //form unputs
          const inputTokenName = document.createElement("input");
          inputTokenName.type = "text";
          inputTokenName.name = "tokenName";
          inputTokenName.value = target.dataset.tokenname;
          inputTokenName.defaultValue = target.dataset.tokenname;

          const inputTokenPublicID = document.createElement("input");
          inputTokenPublicID.type = "text";
          inputTokenPublicID.name = "tokenPublicID";
          inputTokenPublicID.value = target.dataset.tokenpublicid;
          inputTokenPublicID.defaultValue = target.dataset.tokenpublicid;

          const cancelUpdate = document.createElement("input");
          cancelUpdate.type = "button";
          cancelUpdate.value = "Cancel";

          cancelUpdate.addEventListener("click", function (event) {
            event.preventDefault();
            cancelUpdate.parentElement.remove();
          });

          const updateSubmit = document.createElement("input");
          updateSubmit.type = "submit";
          updateSubmit.disabled = true;

          inlineForm.appendChild(inputTokenName);
          inlineForm.appendChild(inputTokenPublicID);
          inlineForm.appendChild(cancelUpdate);
          inlineForm.appendChild(updateSubmit);

          target.insertAdjacentElement("afterEnd", inlineForm);

          inlineForm.addEventListener("input", function (event) {
            if (
              inputTokenName.value == inputTokenName.defaultValue &&
              inputTokenPublicID.value == inputTokenPublicID.defaultValue
            ) {
              updateSubmit.disabled = true;
            } else {
              updateSubmit.disabled = false;
            }
          });

          inlineForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const payload = {
              tokenName: inputTokenName.value,
              tokenPublicID: inputTokenPublicID.value,
              tokenID: target.dataset.tokenid,
            };
            await UpdateOneToken(payload);
          });
        }
      });
    });
  } else {
    if (document.querySelector(".stored-coins ul")) {
      document.querySelector(".stored-coins ul").remove();
    }
    if (document.querySelector(".stored-coins h3")) {
      document.querySelector(".stored-coins h3").remove();
    }

    if (document.querySelector(".stored-coins >a")) {
      document.querySelector(".stored-coins >a").remove();
    }

    //Add a 'Add a new token' button
    const addNewTokenButton = document.createElement("a");
    addNewTokenButton.text = "Add token";
    addNewTokenButton.href = "#";

    addNewTokenButton.addEventListener("click", function (event) {
      event.preventDefault();
      document.querySelector("#add-token").classList.remove("hidden");
      document.querySelector("#add-token").classList.add("visible");
    });

    document
      .querySelector(".stored-coins")
      .insertAdjacentElement("beforeend", addNewTokenButton);

    const titleNoTokensFinded = document.createElement("h3");
    titleNoTokensFinded.innerText = "No tokends saved, please add a new one";

    document
      .querySelector(".stored-coins")
      .insertAdjacentElement("afterbegin", titleNoTokensFinded);
  }
}

//CRUD Stored tokens
async function SaveOneToken(tokenData) {
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" }, //This can be a header object or literal string object {''}
    body: JSON.stringify(tokenData), //Convert the object to JSON to fastify validations
  };

  const request = await fetch(APPCONFIG.API + "/coin/data/add/", opts);
  const token = await request.text();

  Toastify({
    text: "Token Saved",
    duration: 3000,
  }).showToast();

  GetPrices();
  GetStoredTokens();
}
async function DeleteOneTOken(tokenPublicID) {
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" }, //This can be a header object or literal string object {''}
    body: JSON.stringify(tokenPublicID), //Convert the object to JSON to fastify validations
  };

  const request = await fetch(APPCONFIG.API + "/coin/data/delete/", opts);
  const token = await request.text();

  Toastify({
    text: "Token Deleted",
    duration: 3000,
  }).showToast();

  GetStoredTokens();
}
async function UpdateOneToken(tokenData) {
  const opts = {
    method: "PUT",
    headers: { "Content-Type": "application/json" }, //This can be a header object or literal string object {''}
    body: JSON.stringify(tokenData), //Convert the object to JSON to fastify validations
  };

  const request = await fetch(APPCONFIG.API + "/coin/data/update/", opts);
  const token = await request.text();

  Toastify({
    text: "Token Updated",
    duration: 3000,
  }).showToast();

  GetStoredTokens();
  GetPrices();
}

//Add token form logic
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

  formAddToken.classList.remove("visible");
  formAddToken.classList.add("hidden");
});

const closeFormAddToken = formAddToken.querySelector("a.cancel");
closeFormAddToken.addEventListener("click", function (event) {
  event.preventDefault();
  formAddToken.reset();
  formAddToken.classList.remove("visible");
  formAddToken.classList.add("hidden");
});
