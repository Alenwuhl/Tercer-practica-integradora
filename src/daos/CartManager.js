//CART MANAGER
import { cartModel } from "./mongo/models/cart.model.js";
import * as CartController from "../controllers/cart.controller.js";
import { ProductManager } from "./ProductManager.js";
import TicketManager from './TicketManager.js'
class CartManager {
  constructor() {
    this.model = cartModel;
    this.productManager = new ProductManager();
  }

  async finishBuying(cartId, user) {
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    let unavailableProducts = [];
    let purchaseTotal = 0;
    let availableProducts = [];

    const productChecks = cart.items.map(async (item) => {
      let product = await this.productManager.getProductById(item.productId);

      if (!product) {
        throw new Error("Item not found");
      }
      if (product.stock < item.quantity) {
        unavailableProducts.push(product);
      } else {
        purchaseTotal += product.price * item.quantity;
        let result = await this.productManager.restProductQuantity(product.id, item.quantity)
        if (!result) {
          unavailableProducts.push(product)
        }else{
          availableProducts.push(item);
        }
        console.log('cartManager - finishBuying result - available:', availableProducts);     
        console.log('cartManager - finishBuying result - unavailable:', unavailableProducts);
      }
    });
    await Promise.all(productChecks);
    let ticketManager = new TicketManager()
    const result = await ticketManager.addTicketFromCart(availableProducts, purchaseTotal, user)
    console.log('cartManager - unavailableProducts:', unavailableProducts, 'purchaseTotal: ', purchaseTotal, 'availableProducts:', availableProducts, 'result:', result);
    return { unavailableProducts, purchaseTotal, availableProducts, result };
  }

  async addCart(cart) {
    // Verificar si todos los productos en el carrito existen
    console.log("cartManager.addCart - " + JSON.stringify(cart));
    const productIds = cart.items.map((item) => item.productId);
    try {
      for (const productId of productIds) {
        const productExists = await this.productManager.productExists(
          productId
        );
        console.log("cartManager - " + productExists + " - " + productId);
        if (!productExists) {
          console.log(`Producto con ID ${productId} no encontrado.`);
          throw new Error(`Producto con ID ${productId} no encontrado.`);
        }
      }
      await CartController.saveCart(cart);
    } catch (err) {
      throw err;
    }
  }

  async getCarts() {
    try {
      return CartController.getAllCarts();
    } catch (err) {
      throw err;
    }
  }

  async getCartById(id) {
    try {
      return await this.model.findById(id);
    } catch (err) {
      throw err;
    }
  }

  async updateCartItem(id, updatedFields) {
    try {
      return await this.model.findByIdAndUpdate(id, updatedFields, {
        new: true,
      });
    } catch (err) {
      throw err;
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
      // Verificar si el producto existe
      const product = await this.productManager.getProductById(productId);
      if (!product) {
        throw new Error(`Producto con ID ${productId} no encontrado.`);
      }
      return await CartController.addProductToCart(cartId, productId, quantity);
    } catch (err) {
      throw err;
    }
  }

  async deleteCartProduct(cartId, productId) {
    try {
      let cart = await this.model.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );

      await cart.save();
      console.log("Producto eliminado del carrito");
    } catch (error) {
      console.error(
        "Hubo un error al eliminar el producto del carrito:",
        error
      );
      throw error;
    }
  }

  async deleteCart(cartId) {
    try {
      const cart = await this.model.findByIdAndDelete(cartId);
      if (!cart) {
        console.log("Carrito no encontrado");
        throw new Error("Carrito no encontrado");
      }
      console.log("Carrito eliminado con éxito");
    } catch (error) {
      console.error("Hubo un error al eliminar el carrito:", error);
      throw error;
    }
  }
}

export { CartManager };
