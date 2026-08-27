import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { PRODUCTS } from '../mock-data/products';

export interface ProductFilters {
  origin?: string | null;
  roastLevel?: string | null;
  category?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  search?: string | null;
  sortBy?: 'name' | 'price-asc' | 'price-desc' | 'rating' | null;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: Product[] = PRODUCTS;

  getProducts(filters?: ProductFilters): Observable<Product[]> {
    let result = [...this.products];

    if (filters) {
      if (filters.origin) {
        result = result.filter((p) => p.origin === filters.origin);
      }
      if (filters.roastLevel) {
        result = result.filter((p) => p.roastLevel === filters.roastLevel);
      }
      if (filters.category) {
        result = result.filter((p) => p.category === filters.category);
      }
      if (filters.minPrice != null) {
        result = result.filter((p) => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice != null) {
        result = result.filter((p) => p.price <= filters.maxPrice!);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.origin.toLowerCase().includes(q) ||
            p.flavorNotes.some((n) => n.toLowerCase().includes(q))
        );
      }

      switch (filters.sortBy) {
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    return of(result).pipe(delay(120));
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find((p) => p.id === id);
    return of(product).pipe(delay(80));
  }

  getOrigins(): Observable<string[]> {
    const origins = [...new Set(this.products.map((p) => p.origin))].sort();
    return of(origins);
  }

  getRoastLevels(): Observable<string[]> {
    return of(['light', 'medium', 'dark']);
  }

  getCategories(): Observable<string[]> {
    const cats = [...new Set(this.products.map((p) => p.category))].sort();
    return of(cats);
  }
}
