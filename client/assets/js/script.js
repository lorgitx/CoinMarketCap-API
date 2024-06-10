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
  const tokens = await ListStoredTokens();

  const divStoredToken = document.querySelector(".stored-coins");

  const formAddToken = document.createElement("form");
  const ul = document.createElement("ul");
  const inlineForm = document.createElement("form");

  const titleNoTokensFinded = document.createElement("h3");
  const addNewTokenButton = document.createElement("a");

  if (tokens.length == 0) {
    //Add title 'No tokens sabed'
    titleNoTokensFinded.innerText = "No tokends saved, please add a new one";
    document
      .querySelector(".stored-coins")
      .insertAdjacentElement("afterbegin", titleNoTokensFinded);
  } else {
    for (const token of tokens) {
      ul.insertAdjacentHTML(
        "beforeend",
        `<li >${token.tokenName} : ${token.tokenPublicID} | <a class="delete-token" href="" data-tokenid="${token.tokenPublicID}">Delete</a> | <a class="edit-token" href="" data-tokenpublicid="${token.tokenPublicID}" data-tokenid="${token._id}" data-tokenname="${token.tokenName}">Edit</a> </li>`
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
          divStoredToken.innerHTML = "";
          divStoredToken = null;
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

          const target = event.target;

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
            divStoredToken.innerHTML = "";
            divStoredToken = null;
          });
        }
      });
    });
  }

  //Add inline form to add new tokens
  formAddToken.id = "add-token";
  formAddToken.classList.add("dpnone");

  const inputTokenName = document.createElement("input");
  inputTokenName.name = "tokenName";
  inputTokenName.placeholder = "Token name";
  inputTokenName.type = "text";
  inputTokenName.required = true;

  formAddToken.insertAdjacentElement("beforeend", inputTokenName);

  const inputTokenPublicID = document.createElement("input");
  inputTokenPublicID.name = "tokenPublicID";
  inputTokenPublicID.placeholder = "Token ID";
  inputTokenPublicID.type = "text";
  inputTokenPublicID.required = true;

  formAddToken.insertAdjacentElement("beforeend", inputTokenPublicID);

  const cancelUpdate = document.createElement("input");
  cancelUpdate.type = "button";
  cancelUpdate.value = "Cancel";

  cancelUpdate.addEventListener("click", function (event) {
    event.preventDefault();
    event.target.parentElement.reset();
    addNewTokenButton.classList.toggle("dpnone");
    formAddToken.classList.toggle("dpnone");
  });

  formAddToken.insertAdjacentElement("beforeend", cancelUpdate);

  const submitInput = document.createElement("input");
  submitInput.type = "submit";
  submitInput.value = "Add token";
  submitInput.disabled = true;

  formAddToken.insertAdjacentElement("beforeend", submitInput);

  //Form Validations
  formAddToken.addEventListener("input", function (event) {
    if (inputTokenName.value && inputTokenPublicID.value) {
      submitInput.disabled = false;
    } else {
      submitInput.disabled = true;
    }
  });

  //Add token form logic
  formAddToken.addEventListener("submit", async function (event) {
    event.preventDefault();
    const { target } = event;
    const payload = {
      tokenName: target.tokenName.value,
      tokenPublicID: target.tokenPublicID.value,
    };
    await SaveOneToken(payload);
    divStoredToken.innerHTML = "";
    divStoredToken = null;
  });

  document
    .querySelector(".stored-coins")
    .insertAdjacentElement("beforeend", formAddToken);

  //Add button to show the form to add new token
  addNewTokenButton.text = "Add token";
  addNewTokenButton.href = "#";

  addNewTokenButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.target.classList.add("dpnone");
    formAddToken.classList.toggle("dpnone");
    inputTokenName.focus();
  });

  document
    .querySelector(".stored-coins")
    .insertAdjacentElement("beforeend", addNewTokenButton);
}

//CRUD Stored tokens
async function ListStoredTokens() {
  const request = await fetch(APPCONFIG.API + "/coin/data/list/");
  return (tokens = await request.json());
}
async function SaveOneToken(tokenData) {
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" }, //This can be a header object or literal string object {''}
    body: JSON.stringify(tokenData), //Convert the object to JSON to fastify validations
  };

  const request = await fetch(APPCONFIG.API + "/coin/data/add/", opts);
  const token = await request.text();

  NotificationMSG("Token Saved");

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

  NotificationMSG("Token Deleted");
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

  NotificationMSG("Token Updated");

  GetStoredTokens();
  GetPrices();
}

//Utils
function NotificationMSG(msg) {
  Toastify({
    text: msg,
    duration: 3000,
  }).showToast();
}
