export enum Permittion {
  VIEW = 'view',
  UPDATE = 'update',
  DELETE = 'delete',
}

export interface PurchaseItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseMarketEmail {
  email: string;
  permittions: Permittion[];
  creator: boolean;
}

export interface PurchaseMakert {
  _id: string;
  marketName: string;
  totalPrice: number;
  items: PurchaseItem[];
  emails: PurchaseMarketEmail[];
}
