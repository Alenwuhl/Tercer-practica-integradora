
import * as ticketController from "../controllers/ticket.controller.js";
import config from "../config/config.js";
import ticketModel from "./mongo/models/ticket.model.js";
import { ProductManager } from "./ProductManager.js";
import { EmailManager } from "./EmailManager.js";

class TicketManager {
  constructor() {
    this.model = ticketModel;
    this.productManager = new ProductManager();
    this.emailManager = new EmailManager();
  }

  async addTicket(ticket) {
    try {
      return await ticketController.saveTicket(ticket);
    } catch (err) {
      throw err;
    }
  }

  async addTicketFromCart(cartItems, purchaseTotal, user) {
    try {
      let ticketItems = [];
      await Promise.all(
        cartItems.map(async (item) => {
          let product = await this.productManager.getProductById(
            item.productId
          );
          console.log("ticketManager - product:", product);
          let ticketItem = {
            id: product.id,
            name: product.title,
            price: product.price,
            quantity: item.quantity,
          };
          ticketItems.push(ticketItem);
        })
      );
      let ticket = {
        purchaser: user,
        amount: purchaseTotal,
        ticketItems: ticketItems,
        purchase_datetime: new Date(),
        code: Math.random().toString(36).slice(2, 11),
      };

      console.log("ticketManager - Ticket:", ticket);
      const result = await this.addTicket(ticket);

      const emailResult = await this.sendEmailTicket(ticket);
      return { result, emailResult };
    } catch (error) {
      throw error;
    }
  }

  async sendEmailTicket(ticket) {
    let email = {
      from: `${config.gmailAccount}`,
      to: `${ticket.purchaser.email}`,
      subject: "Confirmación de tu compra",
      html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #007bff;">¡Gracias por tu compra!</h2>
            <p>Hola, <strong>${ticket.purchaser.name}</strong>,</p>
            <p>Hemos recibido tu pedido y está siendo procesado. Aquí están los detalles de tu compra:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
              <h4>Resumen de la Compra</h4>
              <p><strong>ID de la Compra:</strong> ${ticket.code}</p>
              <p><strong>Fecha:</strong> ${new Date(
                ticket.purchase_datetime
              ).toLocaleDateString()}</p>
              <p><strong>Total:</strong> $${ticket.amount}</p>
            </div>
            
            <h4>Productos:</h4>
            <ul>
              ${ticket.ticketItems
                .map(
                  (item) =>
                    `<li>${item.quantity} x ${item.name} - $${item.price}</li>`
                )
                .join("")}
            </ul>
            
            <p>Si tienes alguna pregunta, no dudes en responder este correo.</p>
            <p>¡Gracias por confiar en nosotros!</p>
          </div>
        `,
      attachments: [],
    };
    this.emailManager.sendEmail(email);
  }
}

export default TicketManager;
