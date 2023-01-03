const form = document.querySelector("form");
const content = document.querySelector(".content");

function loader(element, isWaiting) {
  if (isWaiting) {
    element.innerHTML = `<div class="loader"></div>`;
  } else {
    element.innerHTML = "";
  }
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timeStamp = Date.now();
  const id = timeStamp.toString(16);

  return `id-${id}`;
}

function chatMessage(isAi, value, id) {
  return `
      <div class="content-container ${isAi ? "bot" : "user"}">
        <img calss="content-img" src="./assets/${
          isAi ? "bot.svg" : "user.svg"
        }" />
        <div class="content-text" id=${id}>
          ${value}         
        </div>
      </div>
    `;
}

async function handleSubmit(e) {
  e.preventDefault();
  const t = document.getElementById("text");
  const text = t.value.trim();
  
  t.value = "";

  content.innerHTML += chatMessage(false, text);

  const uniqueId = generateUniqueId();
  content.innerHTML += chatMessage(true, " ", uniqueId);

  content.scrollTop = content.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv, true);

  const respons = await fetch("https://open-chat-ai.onrender.com", {
    method: "POST",
    headers: {
      "Conten-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: text,
    }),
  });

  loader(messageDiv, false);

  if (respons.ok) {
    const data = await respons.json();
    const parsData = data.bot.trim();

    typeText(messageDiv, parsData);
  } else {
    const err = await respons.text();
    messageDiv.innerHTML = "Spmething went wrong!";

    alert(err);
  }
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
