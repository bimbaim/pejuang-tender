// File: src/types/tender.ts
export interface Tender {
  id: string;
  title: string;
  agency: string;
  budget: string;
  source_url: string; // URL yang akan digunakan pada tombol
  qualification_method: string;
}