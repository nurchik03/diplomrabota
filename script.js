const tg = window.Telegram.WebApp;
tg.expand();

const pizzas = [
  { name: "Маргарита", weight: "500 г", price: 588, img: "https://staticcontent.mypizza.kg/Dishes/Imperiia_Pitstsyi/v1/Pitstsa_30sm/Margarita_30sm/Medium.png?hash=e7ac3d125c355e46ec2091677801f5eb" },

  { name: "Пепперони", price: 758, img: "https://staticcontent.mypizza.kg/Dishes/Imperiia_Pitstsyi/v1/Pitstsa_30sm/Pepperoni_30sm/Medium.png?hash=21df342a79807048d67e34d64d9a0d1a" },

  { name: "4 Сыра", price: 988, img: "https://staticcontent.mypizza.kg/Dishes/Imperiia_Pitstsyi/v45/Pitstsa_30sm/4_Syira_30sm/Medium.png?hash=f530c2fc1726d73286f6656fd56d59ae" },

  { name: "Гасконская ", price: 988, img: "https://staticcontent.mypizza.kg/Dishes/Imperiia_Pitstsyi/v10/Pitstsa_30sm/Gaskonskaia_30sm/Medium.png?hash=5ad10721beff448a1c86e59f30d3c2d9" },

  { name: "Мегапепперони ", price: 838, img: "https://staticcontent.mypizza.kg/Dishes/Imperiia_Pitstsyi/v10/Pitstsa_40sm/Megapepperoni_40sm/Medium.png?hash=f80abeaf0117913c6f626981c349d582" },

  { name: "Барбекю", price: 958, img: "https://staticcontent.mypizza.kg/Dishes/Imperiia_Pitstsyi/v10/Pitstsa_40sm/Barbekiu_40sm/Medium.png?hash=3b4522fe32379bc2ad5e9649e2faa199" },

  { name: "Вегетарианская", price: 868, img: "https://staticcontent.mypizza.kg/Dishes/Imperiia_Pitstsyi/v32/Pitstsa_40sm/Vegetarianskaia_40sm/Medium.png?hash=5696140c19c5358cc13389a0122876fd" },

  { name: "Обжорка", price: 1098, img: "https://staticcontent.mypizza.kg/Dishes/Imperiia_Pitstsyi/v1/Pitstsa_40sm/Obzhorka_40sm/Medium.png?hash=0fb89dbac3094a820b817af8321d8937" },

  { name: "Цезарь", price: 1088, img: "https://staticcontent.mypizza.kg/Dishes/Imperiia_Pitstsyi/v220/Pitstsa_40sm/Tsezar_40sm/Medium.png?hash=182e506915589cb3139d9c61f0dd5046" },

  { name: "Чили", price: 988, img: "https://staticcontent.mypizza.kg/Dishes/Imperiia_Pitstsyi/v1/Pitstsa_40sm/Chili_40sm/Medium.png?hash=5ca56f52c67401ef1f6b6b7e36a4b0ab" },
];

const order = {};
const grid = document.getElementById("pizza-grid");
const totalDisplay = document.getElementById("total-price");

pizzas.forEach((pizza, index) => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <img src="${pizza.img}" alt="${pizza.name}">
    <h3>${pizza.name}</h3>
    <p>${pizza.price} ₽</p>
    <div class="counter">
      <button onclick="decrease(${index})">−</button>
      <span id="count-${index}">0</span>
      <button onclick="increase(${index})">+</button>
    </div>
  `;

  grid.appendChild(card);
  order[index] = { ...pizza, count: 0 };
});

function increase(index) {
  order[index].count++;
  updateUI(index);
}

function decrease(index) {
  if (order[index].count > 0) {
    order[index].count--;
    updateUI(index);
  }
}

function updateUI(index) {
  document.getElementById(`count-${index}`).innerText = order[index].count;
  updateTotal();
}

function updateTotal() {
  let total = 0;
  Object.values(order).forEach(p => {
    total += p.price * p.count;
  });
  totalDisplay.innerText = total;
}

function goToCheckout() {
  const selected = Object.values(order).filter(p => p.count > 0);
  if (selected.length === 0) {
    alert("Выберите хотя бы одну пиццу 🍕");
    return;
  }

  localStorage.setItem("cart", JSON.stringify(selected));
  window.location.href = "checkout.html";
}

document.querySelector(".send").addEventListener("click", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  const orderItems = JSON.parse(localStorage.getItem("cart") || "[]");
  const total = orderItems.reduce((sum, item) => sum + item.price * item.count, 0);

  const data = {
    name,
    phone,
    address,
    order: orderItems,
    total
  };

  // Отправка в Telegram WebApp
  if (window.Telegram.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify(data));
    Telegram.WebApp.close();
  } else {
    alert("Бот не инициализирован в Telegram WebApp.");
  }
});
