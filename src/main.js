const BASE_URL = "https://ecommercebackend.fundamentos-29.repl.co/";

async function getProducts() {
   try {
      const data = await fetch(BASE_URL);
      const response = await data.json();
      localStorage.setItem("products", JSON.stringify(response));
      return response;
   } catch (error) {
      console.log(error);
   }
}
function validateAmountProduct(store, id) {
   if (store.cart[id].amount === store.cart[id].quantity) {
      alert("Ya no hay mas en stock");
   } else {
      store.cart[id].amount++;
   }
}
function printHeader(store) {
   let html = ``;

   store.products.find(function (student) {
      if (student.id === 14) {
         html += `
         <div class="home__header">
            <div></div>
            <div class="home__header__img">
            <img src="${student.image}" alt="" /></div>
         </div>
         <div class="home__body">
            <h2 class="home__body__title">
            New Sweatshirt COLLECTIONS 2022
            </h2>
            <p class="home__body__p">
            Latest arrival of the new Hanes Midweight Crewneck sweatshirt
            imported from the 2022 series, with a modern design.
            </p>
            <p class="home__body__price">$${student.price}.00</p>
            <a href="#products" class="home__body__btn">Show more</a>
         </div>`;
      }
   });
   // <img src="${student.image}" alt="" />
   document.querySelector(".home").innerHTML = html;
}

function printProducts(store) {
   let html = "";
   store.products.forEach(function ({ id, image, name, price, quantity }) {
      html += `
         <div class="product">
            <div class="product__img">
               <img src="${image}" alt=""/>
            </div>
            <h3>${name}</h3>
            <p>$${price}.0 - ${
         quantity === 0
            ? `<b class="product__soldout">Sold out</b>`
            : quantity + ` unidades`
      }</p>
            
            ${
               quantity
                  ? `<button class="product__btn" id="${id}">Agregar</button>`
                  : `<div ></div>`
            }
         </div>
      `;
   });
   document.querySelector(".products").innerHTML = html;
}

function handleShowCart() {
   const iconCart = document.querySelector(".icon__cart");
   const cart = document.querySelector(".cart");
   iconCart.addEventListener("click", function () {
      cart.classList.toggle("cart__show");
   });
}

function printProductsInCart(store) {
   //Pintar productos en el carrito
   let html = "";

   for (const key in store.cart) {
      const { amount, id, image, name, price, quantity } = store.cart[key];
      html += `
               <div class="cart__product">
                  <div class="cart__product__img">
                     <img src="${image}" alt=""/>
                  </div>
                  <div class ="cart__product__body">
                     <p>
                        <b>${name}</b>
                     </p>
                     <p>
                        <small>Stock: ${quantity} | $${price}</small>
                     </p>
                     <p>
                        <smal><b>Subtotal: $${amount * price}</b></smal>
                     </p>
                     <div class="cart__product__opt" id="${id}">
                        <i class='bx bx-minus'></i>
                        <span>${amount} units</span>
                        <i class='bx bx-plus'></i>
                        <i class='bx bxs-trash'></i>
                     </div>
                  </div>
               </div>
            `;
   }
   document.querySelector(".cart__products").innerHTML = html;
}
function addToCartFromProducts(store) {
   const productsHTML = document.querySelector(".products");
   productsHTML.addEventListener("click", function (e) {
      if (e.target.classList.contains("product__btn")) {
         const id = Number(e.target.id);
         const productFound = store.products.find(function (product) {
            return product.id === id;
         });
         //amount
         if (store.cart[productFound.id]) {
            validateAmountProduct(store, productFound.id);
         } else {
            store.cart[productFound.id] = {
               ...productFound,
               amount: 1,
            };
         }
         localStorage.setItem("cart", JSON.stringify(store.cart));
         printProductsInCart(store);
         printTotal(store);
      }
   });
}
function printTotal(store) {
   let totalProducts = 0;
   let totalPrice = 0;
   for (const key in store.cart) {
      const { amount, price } = store.cart[key];
      totalProducts += amount;
      totalPrice += amount * price;
   }
   document.querySelector("#totalProducts").textContent = totalProducts;
   document.querySelector("#totalPrice").textContent = totalPrice;
   document.querySelector(".ball").textContent = totalProducts;
}
function handleCart(store) {
   document
      .querySelector(".cart__products")
      .addEventListener("click", function (e) {
         if (e.target.classList.contains("bx")) {
            const id = Number(e.target.parentElement.id);
            if (e.target.classList.contains("bx-minus")) {
               if (store.cart[id].amount === 1) {
                  const response = confirm("Seguro quieres eliminar?");
                  if (response) {
                     delete store.cart[id];
                  }
               } else {
                  store.cart[id].amount--;
               }
            }
            if (e.target.classList.contains("bx-plus")) {
               validateAmountProduct(store, id);
            }
            if (e.target.classList.contains("bxs-trash")) {
               const response = confirm("Seguro quieres eliminar?");
               if (response) {
                  delete store.cart[id];
               }
            }
            localStorage.setItem("cart", JSON.stringify(store.cart));
            printProductsInCart(store);
            printTotal(store);
         }
      });
}
function handleTotal(store) {
   document.querySelector(".btn__buy").addEventListener("click", function () {
      if (!Object.values(store.cart).length)
         return alert("Y si primero compras algo?");
      const response = confirm("Seguro que quieres comprar?");
      if (!response) return;
      const newArr = [];
      store.products.forEach((product) => {
         if (store.cart[product.id]) {
            newArr.push({
               ...product,
               quantity: product.quantity - store.cart[product.id].amount,
            });
         } else {
            newArr.push(product);
         }
      });
      store.products = newArr;
      store.cart = {};
      localStorage.setItem("products", JSON.stringify(store.products));
      localStorage.setItem("cart", JSON.stringify(store.cart));
      printProducts(store);
      printProductsInCart(store);
      printTotal(store);
      setTimeout(function () {
         location.reload();
      }, 1000);
   });
}
function filterProducts(store) {
   const buttons = document.querySelectorAll(".content__filter .filter");
   buttons.forEach(function (button) {
      button.addEventListener("click", (e) => {
         buttons.forEach((elementWithFilter) => {
            elementWithFilter.classList.remove("filter__active");
         });
         e.currentTarget.classList.add("filter__active");
         const filter = e.currentTarget.id;
         if (filter === "all") {
            printProducts(store);
         } else {
            const newArrFilter = store.products.filter((product) => {
               return product.category === filter;
            });
            const newStore = {
               products: structuredClone(newArrFilter),
            };
            printProducts(newStore);
         }
      });
   });
}
async function main() {
   const store = {
      products:
         JSON.parse(localStorage.getItem("products")) || (await getProducts()),
      cart: JSON.parse(localStorage.getItem("cart")) || {},
   };
   printHeader(store);
   printProducts(store);
   filterProducts(store);
   handleShowCart();
   addToCartFromProducts(store);
   printProductsInCart(store);
   handleCart(store);
   printTotal(store);
   handleTotal(store);
}
main();
