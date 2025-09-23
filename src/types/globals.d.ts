// src/types/globals.d.ts
export {};

declare global {
  // ... (other interfaces like DataLayerItem, ViewItemListEcommerceData remain the same)

  // Antarmuka untuk objek e-commerce, digunakan oleh event seperti
  // 'view_cart', 'add_to_cart', 'begin_checkout', dan sekarang 'purchase'
  interface StandardEcommerceData {
    currency: string;
    value: number;
    items: DataLayerItem[];
    // Menambahkan properti spesifik untuk event purchase
    transaction_id?: string;
    affiliation?: string;
    tax?: number;
    shipping?: number;
  }

  // Antarmuka untuk event 'view_item_list', yang memiliki struktur berbeda
  interface ViewItemListEcommerceData {
    items: DataLayerItem[];
    item_list_id: string;
    item_list_name: string;
  }

  // Union type yang menggabungkan semua struktur event yang mungkin
  type DataLayerEvent =
    | { event: "view_item_list"; ecommerce: ViewItemListEcommerceData }
    | { event: "add_to_cart" | "begin_checkout" | "view_cart" | "purchase"; ecommerce: StandardEcommerceData };

  // Mendeklarasikan window.dataLayer sebagai array dari union type yang baru
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}