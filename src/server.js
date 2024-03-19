import express from 'express';
import path from 'path';
import { __dirname } from './utils.js';

//.env configuration
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, 'config', '.env') })
import config from './config/config.js';

import handlebars from "express-handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import Handlebars from "handlebars";
import session from "express-session";
import passport from 'passport';
import initializePassport from "./config/passport.config.js";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import MongoSingleton from './config/singleton.config.js';

//Routes imports
import cartRouter from "./routes/carts.route.js";
import productRouter from "./routes/products.route.js";
import viewRouter from "./routes/views.routes.js";
import sessionsRouter from "./routes/sessions.router.js";
import usersViewRouter from "./routes/users.views.router.js";
import loggerTestRouter from "./routes/logger.routes.js"
import { addLogger } from './config/loggerCustom.js';


const app = express();

// Aplica el middleware del logger
app.use(addLogger);

const port = config.port;

const httpServer = app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
);

const secret = config.sessionSecret

//configuracoón de Session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongoUrl,
      ttl: 10 * 60,
    }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cookieParser(secret));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);

app.set("view engine", "hbs");
app.set("views", `${__dirname}/views`);

//Routes
app.use(express.static(`${__dirname}/public`));
app.use("/", viewRouter);

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/users", usersViewRouter);
app.use("/api/users", sessionsRouter);
app.use("/loggerTest", loggerTestRouter)

//Passport Middleware
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

