// src/types/globals.d.ts
export {};

declare global {
  // Antarmuka untuk item e-commerce
  interface DataLayerItem {
    item_id?: string;
    item_name?: string;
    price?: number;
    item_category?: string;
    item_variant?: string;
    item_list_name?: string;
  }

  // Antarmuka untuk objek e-commerce yang digunakan oleh
  // 'view_cart', 'add_to_cart', 'begin_checkout', dan 'purchase'
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

  // Antarmuka untuk event 'view_item_list'
  interface ViewItemListEcommerceData {
    items: DataLayerItem[];
    item_list_id: string;
    item_list_name: string;
  }

  // Union type yang menggabungkan semua struktur event
  type DataLayerEvent =
    | { event: "view_item_list"; ecommerce: ViewItemListEcommerceData }
    | { event: "add_to_cart" | "begin_checkout" | "view_cart" | "purchase"; ecommerce: StandardEcommerceData };

  // Mendeklarasikan window.dataLayer sebagai array dari union type yang baru
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}