// Para trabajar Factory
import { cartService } from "../services/factory.js";

// Para trabajar con repository
//import { cartService } from '../services/repository.js';

export async function getAllCarts() {
  try {
    let carts = await cartService.getAll();
    return carts;
  } catch (error) {
    console.error(error);
    return error;
  }
}
export async function saveCart(cart) {
  try {
    // const studentDto = new StudentsDto(req.body);
    console.log("cart.controller - " + JSON.stringify(cart, null, 2));
    let result = await cartService.save(cart);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("No se pudo guardar el carrito.");
  }
}

export async function addProductToCart(cartId, productId, quantity) {
  try {
    // Obtener el carrito por ID o crear uno nuevo si no existe
    console.log("cart.controller -" + cartId);
    let cart = await cartService.getCartById(cartId);
    console.log("cart.controller - getCartById" + cart);
    if (!cart) {
      cart = await cartService.createCart({ id: cartId, items: [] });
    }

    // Buscar si el producto ya existe en el carrito
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex > -1) {
      // Si el producto ya está, actualizar la cantidad
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Si el producto no está, añadirlo al carrito
      cart.items.push({ productId, quantity });
    }
    await cartService.save(cart);

    return cart;
  } catch (error) {
    console.error(error);
    throw new Error("No se pudo agregar el producto al carrito.");
  }
}
