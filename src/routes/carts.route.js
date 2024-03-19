import { Router } from "express";
import { CartManager } from '../daos/CartManager.js';
import { ProductManager } from "../daos/ProductManager.js";
import { authorization } from "../utils.js";

const router = Router();
const cartManager = new CartManager();

router.post("/:cid/purchase", async (req, res) => {
  const cartId = req.params.cid;
  const user = req.session.user;

  try {
    const purchase = await cartManager.finishBuying(cartId, user);

    res.json({
      success: true,
      message: "Compra finalizada con éxito.",
      purchase,
    });
    req.logger.http("Se entró a router.POST - api/carts/:cid/purchase")
  } catch (error) {
    req.logger.error("/:cid/purchase - ", error);
    res
      .status(500)
      .json({
        success: false,
        message: "No se pudo completar la compra.",
        error: error.message,
      });
  }
}),
  router.get("/", async (req, res) => {

    const carts = await cartManager.getCarts();

    try {
      req.logger.http("Se entró a router.GET - api/carts")
      res.json(carts);
    } catch (error) {
      req.logger.error("Hubo un error al devolver los carritos", error);
      res.status(500).send("Hubo un error al devolver los carritos");
    }
  });

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const products = await cartManager.getCartById(cid);
    res.json(products);
    req.logger.http("Se entró a router.GET - api/carts/:cid")
  } catch (error) {
    req.logger.error("Hubo un error al devolver el carrito", error);
    res.status(500).send("Hubo un error al devolver el carrito");
  }
});

router.post("/", authorization(["user", "premium"]), async (req, res) => {
  try {
    req.logger.debug("carts.route  -" + JSON.stringify(req.body));
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      req.logger.debug("carts.route  -" + JSON.stringify({ productId, quantity }));
      return res.status(400).json({ error: "Faltan propiedades obligatorias del carrito." });
    }

    const product = await productManager.getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    if (req.session.user.role === "premium" && req.session.user.email === product.owner) {
      return res.status(403).json({ error: "No puedes agregar tu propio producto al carrito." });
    }

    const cartToBeAdded = {
      items: [
        {
          productId,
          quantity,
        },
      ],
    };
    
    const cart = await cartManager.addCart(cartToBeAdded);
    req.logger.debug("carts.route - " + JSON.stringify(cart));
    res.json({ cart });
    return;
  } catch (error) {
    req.logger.error("carts.route - Hubo un error al agregar el carrito", error);
    res.status(500).send("Hubo un error al agregar el carrito");
  }
});


router.post("/cart/:cartId/product", async (req, res) => {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const result = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/cart/:cartId/product/:productId", async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    await cartManager.deleteCartProduct(cartId, productId);

    res.status(200).send("Producto eliminado del carrito");
    req.logger.http("Se entró a router.DELETE - api/carts/cart/:cartId/product/:productId")
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send(error.message);
  }
});

router.delete("/cart/:cartId", async (req, res) => {
  try {
    const { cartId } = req.params;

    await cartManager.deleteCart(cartId);

    res.status(200).send("Carrito eliminado");
    req.logger.http("Se entró a router.DELETE - api/carts/cart/:cartId")
  } catch (error) {
    req.logger.error(error.message);
    res.status(500).send(error.message);
  }
});

export default router;
