// File: src/types/plan.ts

export interface Features {
//   [key: string]: any; // You can replace `any` with a stricter type later if needed
    kategori?: number;
    lpse?: number;
    keywords?: number;
    email_notifikasi?: boolean;
    wa_notifikasi?: boolean;
}
//   interface Features {
//     kategori?: number;
//     lpse?: number;
//     keywords?: number;
//     email_notifikasi?: boolean;
//     wa_notifikasi?: boolean;
//   }


export interface Plan {
  id: string;
  name: string;
  duration_months: number;
  price: number;
  amount: number;
  features: Features;
  isHighlighted: boolean;
  category: string;   // e.g. "starter", "business", etc.
  duration: number;   // e.g. 3 or 12 months
}
