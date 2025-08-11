export interface PurchaseItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseMakert {
  _id: string;
  marketName: string;
  totalPrice: number;
  items: PurchaseItem[];
}
