let tg = window.Telegram.WebApp;
tg.expand();

const items = document.querySelectorAll('.item');
const totalBlock = document.getElementById('total');
let cart = {};

function updateTotal() {
  let total = 0;
  cart = {};
  items.forEach(item => {
    const name = item.dataset.name;
    const price = parseInt(item.dataset.price);
    const count = parseInt(item.querySelector('.count').innerText);
    if (count > 0) {
      cart[name] = { count, price, sum: price * count };
      total += price * count;
    }
  });
  totalBlock.innerText = `Итого: ${total}₽`;
}

items.forEach(item => {
  const plus = item.querySelector('.plus');
  const minus = item.querySelector('.minus');
  const countSpan = item.querySelector('.count');

  plus.addEventListener('click', () => {
    countSpan.innerText = parseInt(countSpan.innerText) + 1;
    updateTotal();
  });

  minus.addEventListener('click', () => {
    let current = parseInt(countSpan.innerText);
    if (current > 0) {
      countSpan.innerText = current - 1;
      updateTotal();
    }
  });
});

document.getElementById('next').addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    alert('Пожалуйста, выберите хотя бы один товар');
    return;
  }

  document.getElementById('main').style.display = 'none';
  document.getElementById('form').style.display = 'block';

  if (tg.initDataUnsafe.user) {
    const { first_name = "", last_name = "" } = tg.initDataUnsafe.user;
    document.getElementById("user_name").value = `${first_name} ${last_name}`;
  }
});

document.getElementById('order').addEventListener('click', () => {
  document.getElementById("error").innerText = "";

  let name = document.getElementById("user_name").value.trim();
  let email = document.getElementById("user_email").value.trim();
  let phone = document.getElementById("user_phone").value.trim();

  if (name.length < 2) {
    document.getElementById("error").innerText = 'Введите корректное имя';
    return;
  }

  if (!email.includes("@") || email.length < 5) {
    document.getElementById("error").innerText = 'Введите корректный email';
    return;
  }

  if (phone.length < 10) {
    document.getElementById("error").innerText = 'Введите корректный номер телефона';
    return;
  }

  const totalPrice = Object.values(cart).reduce((acc, item) => acc + item.sum, 0);
  const products = Object.entries(cart).map(([name, { count, sum }]) => `${name} × ${count} = ${sum}₽`).join(', ');

  const data = {
    name,
    email,
    phone,
    order: products,
    total: `${totalPrice}₽`
  };

  tg.sendData(JSON.stringify(data));
  tg.close();
});