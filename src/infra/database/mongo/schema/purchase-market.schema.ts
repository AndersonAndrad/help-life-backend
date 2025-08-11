import mongoose, { Schema } from 'mongoose';

export const PurchaseMarketSchema = new Schema(
  {
    marketName: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    items: { type: Array, required: true },
  },
  {
    timestamps: true,
  },
);

export const PurchaseMarketModel = mongoose.model('purchase-market', PurchaseMarketSchema);
