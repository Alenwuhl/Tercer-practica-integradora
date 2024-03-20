import { ticketService } from "../services/factory.js";

export async function saveTicket(ticket) {
  try {
    let result = await ticketService.save(ticket);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("ticket.controller - No se pudo guardar el ticket.", ticket);
  }
}

export async function getTicketById(ticketId) {
    try {
      let result = await ticketService.getTicketById(ticketId);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("ticket.controller - No se pudo obtener el ticket con Id:", ticketId);
    }
  }