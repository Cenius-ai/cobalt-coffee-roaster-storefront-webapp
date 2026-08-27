export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;          // integer cents
  origin: string;
  roastLevel: 'light' | 'medium' | 'dark';
  flavorNotes: string[];
  imageUrl: string;
  stock: number;
  rating: number;         // 0–5, half-star increments
  category: string;       // single-origin, blend, decaf, espresso
  process: string;        // washed, natural, honey, anaerobic
  altitude: string;       // e.g. "1,800–2,200m"
}
