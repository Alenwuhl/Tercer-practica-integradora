import { __dirname } from "../../utils.js";
import fileSystem from "fs";

export default class ProductService {
  #products;
  #dirPath;
  #filePath;
  #fileSystem;

  constructor() {
    this.#products = new Array();
    this.#dirPath = __dirname + "/files";
    this.#filePath = this.#dirPath + "/products.json";
    this.#fileSystem = fileSystem;
  }

  #prepararDirectorioBase = async () => {
    //Creamos el directorio
    await this.#fileSystem.promises.mkdir(this.#dirPath, { recursive: true });
    if (!this.#fileSystem.existsSync(this.#filePath)) {
      //Se crea el archivo vacio.
      await this.#fileSystem.promises.writeFile(this.#filePath, "[]");
    }
  };

  save = async (product) => {
    console.log("Guardar producto:");
    console.log(product);
    product.id = Math.floor(Math.random() * 20000 + 1);
    try {
      await this.#prepararDirectorioBase();
      this.#products = await this.getAll();
      this.#products.push(product);
      //Se sobreescribe el archivos de cursos para persistencia.
      await this.#fileSystem.promises.writeFile(
        this.#filePath,
        JSON.stringify(this.#products)
      );
    } catch (error) {
      console.error(`Error guardando producto: ${error}`);
      throw Error(`Error guardando producto: ${error}`);
    }
  };

  getAll = async () => {
    try {
      //Validamos que exista ya el archivo con productos sino se crea vacío para ingresar nuevos:
      await this.#prepararDirectorioBase();
      //leemos el archivo
      let data = await this.#fileSystem.promises.readFile(
        this.#filePath,
        "utf-8"
      );
      //Obtenemos el JSON String
      //console.info("Archivo JSON obtenido desde archivo: ");
      console.log(data);
      this.#products = JSON.parse(data);
      console.log("Productos encontrados: ");
      console.log(this.#products);
      return this.#products;
    } catch (error) {
      console.error(`Error consultando los productos por archivo, valide el archivo: ${
        this.#dirPath
      }, 
                detalle del error: ${error}`);
      throw Error(`Error consultando los productos por archivo, valide el archivo: ${
        this.#dirPath
      },
             detalle del error: ${error}`);
    }
  };

  async productExists(productId) {
    // Busca el producto por su ID
    this.#products = await this.getAll();
    console.log("product.service - " + this.#products)
    const product = this.#products.find((product) => product.id === productId);
    console.log("product.service - " + product)
    return (product !== undefined);
  }

  async getProductById(productId) {
    this.#products = await this.getAll();
    return this.#products.find((product) => product.id === productId);
  }
}
