import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import {fileURLToPath} from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

//Bcrypt
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//Validamos el hash
export const isValidPassword = (user, password) => {
  console.log(
    `Datos a validar: user-password: ${user.password}, password: ${password}`
  );
  return bcrypt.compareSync(password, user.password);
};

//JWT
export const PRIVATE_KEY = "CMYq-qFsUDouOZmocK7Ykw";

export const generateJWToken = (user) => {
  return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
};

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "User not authenticated or missing token." });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error)
      return res.status(403).send({ error: "Token invalid, Unauthorized!" });
    req.user = credentials.user;
    next();
  });
};

export const authorization = (allowedRoles) => {
  return async (req, res, next) => {
    if (!req.session.user || !req.session.user.role) {
      return res.status(401).send("Unauthorized");
    }
    if (!allowedRoles.includes(req.session.user.role)) {
      return res.status(403).send("Forbidden: el usuario no tiene permisos");
    }
    next();
  }
}
