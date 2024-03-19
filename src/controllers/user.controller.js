//Para trabajar Factory
import { userService } from "../services/factory.js";
import * as utils from "../utils.js";

// Para trabajar Repository
// import { UserService } from '../services/repository.js';
import UsersDto from "../services/dto/user.dto.js";

export async function currentUser(req, res) {
  try {
    console.log("ses", req.session);
    let currentUser = req.session.user;
    let usersDto = new UsersDto(currentUser);
    res.send(usersDto);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo obtener el usuario activo." });
  }
}

export async function findByEmail(email) {
  try {
    let user = await userService.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findById(uid) {
  try {
    let user = await userService.findById(uid);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAllUsers(req, res) {
  try {
    let users = await userService.getAll();
    res.send(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo obtener los usuarios." });
  }
}

export async function saveUser(req, res) {
  try {
    // const userDto = new UserDto(req.body);
    // let result = await userService.save(userDto);
    let result = await userService.save(req.body);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: error, message: "No se pudo guardar el estudiante." });
  }
}

export async function updateUser(filter, value) {
  try {
    let result = await userService.update(filter, value);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function updatePassword(email, newPassword) {
  try {
    const hashedPassword = utils.createHash(newPassword);
    const filter = { email: email };
    const update = { $set: { password: hashedPassword } };

    const result = await userService.update(filter, update);
    console.log("Contraseña actualizada con éxito para", email);
    return result;
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    throw new Error("Error al actualizar la contraseña.");
  }
}
