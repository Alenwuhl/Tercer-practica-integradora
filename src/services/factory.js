import config from "../config/config.js";
import MongoSingleton from "../config/singleton.config.js";

let productService;
let userService;
let cartService;
let ticketService;

async function initializeMongoService() {
  console.log("Iniciando Servicio para Mongo!!");
  try {
      await MongoSingleton.getInstance();
  } catch (error) {
      console.error("Error al iniciar MongoDB:", error);
      process.exit(1); // Salir con código de error
  }
}


switch (config.persistance) {
  case "mongodb":
    initializeMongoService();
    const { default: UserServiceMongo } = await import('../daos/mongo/users.service.js')
    userService = new UserServiceMongo
    console.log("Servicio de usuarios cargado:");
    console.log(userService);

    const { default: TicketServiceMongo } = await import('../daos/mongo/ticket.service.js')
    ticketService = new TicketServiceMongo
    console.log("Servicio de tickets cargado:");
    console.log(ticketService);

    const { default: ProductsServiceMongo } = await import('../daos/mongo/products.service.js')
    productService = new ProductsServiceMongo
    console.log("Servicio de productos cargado:");
    console.log(productService);

    const { default: CartsServiceMongo } = await import('../daos/mongo/carts.service.js')
    cartService = new CartsServiceMongo
    console.log("Servicio de carritos de mongodb cargado:");
    console.log(cartService);
    break;


  case "file":
    // IMPORTARME le DAO
    const { default: ProductServiceFileSystem } = await import('../daos/filesystem/products.service.js')
    productService = new ProductServiceFileSystem
    console.log("Servicio de productos cargado:");
    console.log(productService);

    const { default: UserServiceFileSystem } = await import('../daos/filesystem/users.service.js')
    userService = new UserServiceFileSystem
    console.log("Servicio de usuarios cargado:");
    console.log(userService);

    const { default: CartServiceFileSystem } = await import('../daos/filesystem/carts.service.js')
    cartService = new CartServiceFileSystem
    console.log("Servicio de carritos cargado:");
    console.log(cartService);
    break;

default:
    console.error("Persistencia no válida en la configuración:", config.persistance);
    process.exit(1); 
    break;
}


export { productService, userService, cartService, ticketService };
