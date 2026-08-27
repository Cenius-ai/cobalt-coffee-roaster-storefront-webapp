import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'cobalt_cart';

  private _items = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this._items.asReadonly();

  readonly itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  readonly isEmpty = computed(() => this._items().length === 0);

  addItem(product: Product, quantity: number = 1): void {
    const current = this._items();
    const existing = current.find((i) => i.productId === product.id);

    if (existing) {
      this._items.set(
        current.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
            : i
        )
      );
    } else {
      this._items.set([
        ...current,
        { productId: product.id, quantity: Math.min(quantity, product.stock), product },
      ]);
    }
    this.persist();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const current = this._items();
    const item = current.find((i) => i.productId === productId);
    if (!item) return;
    const capped = Math.min(quantity, item.product.stock);
    this._items.set(
      current.map((i) => (i.productId === productId ? { ...i, quantity: capped } : i))
    );
    this.persist();
  }

  removeItem(productId: number): void {
    this._items.set(this._items().filter((i) => i.productId !== productId));
    this.persist();
  }

  clear(): void {
    this._items.set([]);
    this.persist();
  }

  private persist(): void {
    try {
      const data = this._items().map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        product: i.product,
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage unavailable — no-op
    }
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as CartItem[];
    } catch {
      return [];
    }
  }
}
