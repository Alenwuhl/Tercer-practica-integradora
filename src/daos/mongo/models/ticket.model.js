import mongoose from "mongoose";

const collection = 'ticket'

// Definir el esquema del ticket
const schema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: () => Math.random().toString(36).slice(2, 11),
  },
  purchase_datetime: {
    type: Date,
    default: Date.now(), 
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: Object,
    required: true,
  },
  ticketItems: [],
});

const ticketModel = mongoose.model(collection, schema);

export default ticketModel
