import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const CartSchema = new Schema({
  items: [CartItemSchema]
});

const cartModel = model('Cart', CartSchema);

export { cartModel }