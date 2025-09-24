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

  // Antarmuka untuk objek e-commerce standar
  interface StandardEcommerceData {
    currency?: string;
    value?: number;
    items?: DataLayerItem[];
    transaction_id?: string;
    affiliation?: string;
    tax?: number;
    shipping?: number;
    item_list_id?: string;
    item_list_name?: string;
  }

  // Antarmuka untuk event 'view_item_list'
  interface ViewItemListEcommerceData {
    items: DataLayerItem[];
    item_list_id: string;
    item_list_name: string;
  }

  // Antarmuka untuk objek GTM
  interface GTMData {
    uniqueEventId?: number;
    start?: number;
    priorityId?: number;
    scrollThreshold?: number;
    scrollUnits?: string;
    scrollDirection?: string;
    triggers?: string;
  }

  // Union type yang menggabungkan semua struktur event
  type DataLayerEvent =
    | { event: "view_item_list"; ecommerce: ViewItemListEcommerceData, gtm?: GTMData }
    | { event: "add_to_cart" | "begin_checkout" | "view_cart" | "purchase"; ecommerce: StandardEcommerceData, gtm?: GTMData };

  // Mendeklarasikan window.dataLayer sebagai array dari union type
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}
