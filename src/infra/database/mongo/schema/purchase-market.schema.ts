import mongoose, { Schema } from 'mongoose';

const PurchaseItemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  finished: { type: Boolean, required: true, default: false },
  whishList: { type: Boolean, required: true, default: false },
});

const PurchaseMarketEmailSchema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  permittions: [{ type: String, enum: ['view', 'update', 'delete'], required: true }],
  creator: { type: Boolean, required: true, default: false },
});

export const PurchaseMarketSchema = new Schema(
  {
    marketName: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    items: [PurchaseItemSchema],
    emails: [PurchaseMarketEmailSchema],
  },
  {
    timestamps: true,
  },
);

export const PurchaseMarketModel = mongoose.model('purchase-market', PurchaseMarketSchema);
