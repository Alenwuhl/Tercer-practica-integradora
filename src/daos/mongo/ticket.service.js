import mongoose from "mongoose";
import TicketModel from "./models/ticket.model.js";

export default class TicketService {
  constructor() {
    console.log("Database persistence in mongodb");
  }

  save = async (ticket) => {
    let result = await TicketModel.create(ticket);
    return result;
  };

  getTicketById = async (ticketId) => {
    let result = await TicketModel.findOne(ticketId)
    return result
  };
}
