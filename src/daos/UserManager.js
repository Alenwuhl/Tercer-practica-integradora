import mongoose from "mongoose";
import config from "../config/config.js";
import userModel from "./mongo/models/user.model.js";
import { v4 } from "uuid";
import { EmailManager } from "./EmailManager.js";
import * as userController from "../controllers/user.controller.js";
import * as utils from "../utils.js";

class UserManager {
  constructor() {
    this.model = userModel;
    this.emailManager = new EmailManager();
    this.resetTokens = {};
  }

  async changeUserRole(req, res) {
    try {
      const { uid } = req.params; // El ID del usuario a actualizar
      const { newRole } = req.body; // El nuevo rol para el usuario, asumiendo que se envía en el cuerpo de la petición
  
      if (!uid) {
        return res.status(400).send("User id not provided");
      }
      if (!newRole || (newRole !== "user" && newRole !== "premium")) {
        return res.status(400).send("Invalid role provided");
      }

      const user = await userController.findById(uid);
      if (!user) {
        return res.status(404).send("User not found with the provided id");
      }

      const updateResult = await userController.updateUser({ _id: uid }, { role: newRole });

      if (updateResult) {
        return res.status(200).send(`User role updated to ${newRole}`);
      } else {
        return res.status(400).send("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).send("Internal server error");
    }
  }
  
  async sendEmailToResetPasssword(req, res) {
    try {
      const { emailToReset } = req.body;
      if (!emailToReset) {
        return res.status(400).send("Email not provided");
      }

      const user = await userController.findByEmail(emailToReset);
      if (!user) {
        return res.status(404).send("User not found with the provided email");
      }

      const resetToken = v4();
      this.resetTokens[resetToken] = {
        email: emailToReset,
        expires: Date.now() + 3600000,
      };

      let email = {
        from: `${config.gmailAccount}`,
        to: `${emailToReset}`,
        subject: "Restablecimiento de contraseña",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #007bff; text-align: center;">Restablecimiento de Contraseña Solicitado</h2>
            <p>Hola,</p>
            <p>Has recibido este correo electrónico porque tú (o alguien más) ha solicitado el restablecimiento de la contraseña de tu cuenta.</p>
            <p>Para restablecer tu contraseña, por favor haz clic en el siguiente enlace:</p>
            <p style="text-align: center; margin: 30px 0;"><a href="https://localhost:5000/api/users/resetPassword/${resetToken}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer mi contraseña</a></p>
            <p>Si no has solicitado esto, por favor ignora este correo electrónico y tu contraseña permanecerá sin cambios.</p>
            <p>El enlace para restablecer la contraseña es válido por 1 hora.</p>
          </div>
        `,
        attachments: [],
      };

      await this.emailManager.sendEmail(email);
      res.send("Reset password email has been sent");
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ error: error.message, message: "No se pudo enviar el correo" });
    }
  }

  isTokenValid(token) {
    const tokenData = this.resetTokens[token];
    if (!tokenData) return false;
    return Date.now() <= tokenData.expires;
  }

  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      const tokenData = this.resetTokens[token];
      if (!tokenData || Date.now() > tokenData.expires) {
        return res.redirect("/api/users/process-to-reset-password");
      }

      const user = await userController.findByEmail(tokenData.email);
      if (!user) {
        return res
          .status(404)
          .send("Usuario no encontrado. Prueba registrarte.");
      }

      const isSamePassword = utils.isValidPassword(user, newPassword);
      if (isSamePassword) {
        return res
          .status(400)
          .send(
            "La nueva contraseña no puede ser igual a la contraseña actual."
          );
      }

      await userController.updatePassword(tokenData.email, newPassword);

      // Eliminamos el token de restablecimiento para prevenir reuso
      delete this.resetTokens[token];

      res.send("Contraseña actualizada con éxito.");
    } catch (error) {
      console.error(error);
      res.status(500).send({
        error: error.message,
        message: "Error al restablecer la contraseña",
      });
    }
  }
}

export { UserManager };
