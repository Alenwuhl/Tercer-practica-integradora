import { Router } from "express";
import { productModel } from "../daos/mongo/models/product.model.js";
import cookieParser from "cookie-parser";

const router = Router();

router.use(cookieParser());

router.get("/setCookie", (req, res) => {
  res.cookie("coderCookie", "cookie con firma", {
    maxAge: 30000,
    signed: true,
  }).send ('cookie asignada con exito');
});

router.get("/getCookie", (req, res) => {
  res.send(req.signedCookies)
});

router.get("/deleteCookie", (req, res) => {
  res.clearCookie('cooderCookie').send('cookie borrada')
});

router.get("/", (req, res) => {
  res.render("login", {
    title: "Login",
    fileCss: "styles.css",
  });
});

router.get("/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const options = {
      page,
      limit,
      sort: { price: -1 },
    };
    const products = await productModel.paginate({}, options);
    const userData = req.session.user;
    res.render("home", { products, user: userData });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).send("Ocurrió un error al obtener los productos.");
  }
});

// Form
router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", {
    title: "Productos",
    fileCss: "styles.css",
  });
});

//Chat
router.get("/chat", (req, res) => {
  res.render("chat", {
    title: "Chat",
    fileCss: "styles.css",
  });
});

//Logout
router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if(error){
      res.status(500).json({ error: 'error logout', msg: 'Error al cerrar la sesión' });
    } else {
      res.redirect('/');
    }
  });
});

export default router;
