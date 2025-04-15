const cart = JSON.parse(localStorage.getItem("cart") || "[]");
const orderList = document.getElementById("order-list");
const totalDisplay = document.getElementById("total-checkout");

function renderCart() {
  orderList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.count;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x ${item.count} — ${item.price * item.count} ₽
      <button onclick="removeItem(${index})">Удалить</button>
    `;
    orderList.appendChild(li);
  });

  totalDisplay.innerText = total;
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderCart();

document.getElementById("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  const total = cart.reduce((sum, item) => sum + item.price * item.count, 0);

const orderData = {
  name,
  phone,
  address,
  order: cart,
  total: total
};


  // Отправка в Telegram WebApp
  if (window.Telegram.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify(orderData));
    Telegram.WebApp.close();
  } else {
    alert("Бот не инициализирован в Telegram WebApp.");
  }
});
