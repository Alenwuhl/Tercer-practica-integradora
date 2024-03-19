import { cartModel } from "./models/cart.model.js";

export default class CartService {
  constructor() {
    console.log("Database persistence in mongodb");
  }

  getAll = async () => {
    let carts = await cartModel.find();
    return carts.map((cart) => cart.toObject());
  };

  save = async (cart) => {
    let result = await cartModel.create(cart);
    console.log("cart.service - carrito creado: " + result);
    return result;
  };

  getCartById = async (cartId) => {
    try {
      const cart = await cartModel.findById(cartId);
      return cart;
    } catch (error) {
      console.error("Error getting cart by ID:", error);
      throw error;
    }

    createCart = async (cart) => {
      let result = await cartModel.create(cart);
      console.log("cart.service - carrito creado: " + result);
      return result;
    };
  };
}
