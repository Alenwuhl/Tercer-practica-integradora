// Para trabajar Repository
import { productService } from "../services/factory.js";
//para trabajar con repository 
//import { productService } from '../services/repository.js'

export async function getAllProducts() {
  try {
    let products = await productService.getAll();
    return products;
  } catch (error) {
    console.error(error);
    throw new Error("No se pudo obtener los productos.");
  }
}

export async function saveProduct(product) {
  try {
    // const studentDto = new StudentsDto(req.body);
    let result = await productService.save(product);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("No se pudo guardar el producto.");
  }
}

export async function productExists(productId) {
  try {
    // Comprobar si el producto existe
    return await productService.productExists(productId);
  } catch (error) {
    console.error(error);
    throw new Error("Error al buscar el producto.");
  }
}

export async function getProductById(productId) {
  try {
    return await productService.getProductById(productId);
  } catch (error) {
    console.error(error);
    throw new Error("Error al retornar el producto.");
  }
}

export async function updateProduct(product) {
  try {
    return await productService.updateProduct(product)
  } catch (error) {
    console.error(error);
    throw new Error("product.controller - Error al actualizar el producto.");
  }
}
