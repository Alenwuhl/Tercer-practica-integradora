const socketClient = io();

socketClient.emit("message", "Mensaje desde el formulario");

const buttonAgregar = document.querySelector("#AgregarProductos");
const buttonEliminar = document.querySelector("#EliminarProductos");
const logoutButton = document.querySelector("#logoutButton");

socketClient.on("productsList", (productList) => {
  try {
    console.log("Lista de productos actualizada:", productList);

    if (Array.isArray(productList)) {
      renderProducts(productList);
    } else {
      console.error("El objeto recibido no es un array:", productList);
    }
  } catch (error) {
    console.error("Error al analizar JSON:", error);
  }
});

buttonAgregar.addEventListener("click", (e) => {
  e.preventDefault();

  const code = document.querySelector("#code");
  const title = document.querySelector("#title");
  const price = document.querySelector("#price");
  const category = document.querySelector("#category");
  const stock = document.querySelector("#stock");
  const description = document.querySelector("#description");

  const product = {
    code: code.value,
    title: title.value,
    price: price.value,
    category: category.value,
    stock: stock.value,
    description: description.value,
  };

  socketClient.emit("boton_agregar", product, (error) => {
    console.error("Error al agregar el producto");
  });
});

buttonEliminar.addEventListener("click", (e) => {
  e.preventDefault();

  const codeToDelete = document.querySelector("#codeToDelete").value;

  socketClient.emit("boton_eliminar", codeToDelete, (error) => {
    if (error) {
      console.error("Error al eliminar producto:", error);
    }
  });
});


function renderProducts(products) {
  // document.addEventListener("DOMContentLoaded", () => {
  const productListContainer = document.querySelector("#productListContainer");

  productListContainer.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("cardlist");

    const titleParagraph = document.createElement("h2");
    titleParagraph.classList.add("titlelist");
    titleParagraph.textContent = product.title;

    productCard.appendChild(titleParagraph);

    const codeParagraph = document.createElement("p");
    codeParagraph.classList.add("titlelist");
    codeParagraph.textContent = `Code: ${product.code}`;

    productCard.appendChild(codeParagraph);

    if (product.price) {
      const priceParagraph = document.createElement("p");
      priceParagraph.classList.add("price");
      priceParagraph.textContent = `$${product.price}`;

      productCard.appendChild(priceParagraph);
    }

    productListContainer.appendChild(productCard);
  });
  //  });
}
