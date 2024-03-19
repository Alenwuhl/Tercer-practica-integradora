import mongoose from "mongoose";
import { productModel } from "./models/product.model.js";


export default class ProductService {
  constructor() {
    console.log("Database persistence in mongodb");
  }

  getAll = async () => {
    let products = await productModel.find();
    return products.map((product) => product.toObject());
  };
  save = async (product) => {
    let result = await productModel.create(product);
    return result;
  };

  productExists = async (productId) => {
    try {
        const product = await productModel.findById(productId);
        return product !== null;
      } catch (error) {
        console.error("product.service - Error checking product existence:", error);
        throw error;
      }
  };

  getProductById = async (productId) => {
    try {
      const product = await productModel.findById(productId);
      return product;
    } catch (error) {
      console.error("product.service - Error getting product by ID:", error);
      throw error;
    }
  };

  updateProduct = async (product) => {
    try {
      console.log("product.service - updatedProduct: ", product);
      const result = await productModel.findByIdAndUpdate(product.id, {stock: product.stock})
      return result
    } catch (error) {
      console.error("product.service - Error updating product:", error);
      throw error;
    }
  }
}
