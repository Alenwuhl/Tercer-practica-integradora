import { Router } from "express"
import { ProductManager } from "../daos/ProductManager.js"
import { authorization } from "../utils.js"

const router = Router()
const productManager = new ProductManager()

router.get("/", async (req, res) => {
    const products = await productManager.getProducts()
    const { limit } = req.query

    if (!limit) {
        try{
            res.json(products);
        } catch (error) {
            req.logger.error(`Hubo un error al devolver los productos ${error}`);
            res.status(500).send("Hubo un error al devolver los productos");
        }
    } else {
        try {
            const parsedLimit = parseInt(limit)

            if (isNaN(parsedLimit) || parsedLimit <= 0) {
                return res.send(`El parametro que estableciste como limite (${limit} no es un numero entero.)`)
            }
            const limitedProducts = products.slice(0, parsedLimit);
            res.json(limitedProducts);

        } catch (error) {
            req.logger.error(`Hubo un error al devolver los productos con el limite determinado ${error}`);
            res.status(500).send("Hubo un error al devolver los productos con el limite determinado");
        }
    }
})

router.get("/:pID", async (req, res) => {

    const { pID } = req.params

    if (!pID || pID.trim() === "") {
        try{
            const products = await productManager.getProducts()
            res.json(products);
        } catch (error) {
            req.logger.error("Hubo un error al devolver los productos", error);
            res.status(500).send("Hubo un error al devolver los productos");
        }
    } else {
        try{
            const product = await productManager.getProductById(pID)
            res.json(product)
        } catch (error) {
            req.logger.error("Hubo un error al devolver los productos a traves del ID", error);
            res.status(500).send(`Hubo un error al devolver los productos a traves del ID: ${pID}`);
        }
    }

})

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
  

router.put("/:pid", authorization('admin'), async (req, res) => {
    const { pid } = req.params;
    try{
        const existingProduct = await productManager.getProductById(pid);

        if (!existingProduct) {
            return res.status(404).send(`El producto con ID ${pid} no existe.`);
        }
        
        await productManager.updateProduct(pid, req.body);

        res.json({
            message: `Producto con ID ${pid} actualizado.`,
        });
    } catch (error) {
        req.logger.error("Hubo un error al actualizar el producto", error);
        res.status(500).send("Hubo un error al actualizar el producto");
    }
})

router.delete("/:pid", authorization(['admin', 'premium']), async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }

        if (req.session.user.role === 'premium' && req.session.user.email !== product.owner) {
            return res.status(403).send("Forbidden: No tienes permiso para borrar este producto.");
        }
        const products = await productManager.deleteProduct(pid);
        res.json(products);
    } catch (error) {
        req.logger.error("Hubo un error al borrar el producto", error);
        res.status(500).send("Hubo un error al borrar el producto");
    }
});

export default router;