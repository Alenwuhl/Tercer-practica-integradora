//PRODUCT MANAGER
import { productModel } from "./mongo/models/product.model.js";
import * as ProductController from '../controllers/product.controller.js'


class ProductManager {
  constructor() {
    this.model = productModel;
  }

  async addProduct(product) {
    try {
      await ProductController.saveProduct(product);
    } catch (err) {
      throw err;
    }
  }

  async getProducts() {
    try {
      return ProductController.getAllProducts();
    } catch (err) {
      throw err;
    }
  }

  async getProductById(id) {
    try {
      return await ProductController.getProductById(id);
    } catch (err) {
      throw err;
    }
  }

  async productExists(id) {
    try {
      return await ProductController.productExists(id);
    } catch (err) {
      throw err;
    }
  }

  async restProductQuantity(productId, quantity) {
    console.log('productManager - productId & quantity:', productId, quantity);
    try {
      const product = await this.getProductById(productId)
      if (!product.stock >= quantity) {
        console.log("No hay stock de este producto:", product);
        return false
      }else {
        console.log('ProductManager - Productos a actualizar:', product);
        product.stock -= quantity
        this.updateProduct(product)
        return true
      }
    } catch (err) {
      throw err;
    }
  }

  async updateProduct(product) {
    try {
      return await ProductController.updateProduct(product);
    } catch (err) {
      throw err;
    }
  }

  async deleteProduct(id) {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (err) {
      throw err;
    }
  }

  async deleteProductByCode(code) {
    try {
      return await this.model.deleteOne({ code: code });
    } catch (err) {
      throw err;
    }
  }
}

export { ProductManager };
