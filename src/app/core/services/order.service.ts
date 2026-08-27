import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Order, ShippingAddress } from '../models/order.model';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly STORAGE_KEY = 'cobalt_orders';

  private _orders = signal<Order[]>(this.loadFromStorage());

  readonly orders = this._orders.asReadonly();

  placeOrder(items: CartItem[], address: ShippingAddress): Observable<Order> {
    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const shippingCost = subtotal >= 5000 ? 0 : 499; // free shipping over $50
    const total = subtotal + shippingCost;

    const order: Order = {
      id: this.generateId(),
      items: items.map((i) => ({ ...i })),
      subtotal,
      shippingCost,
      total,
      shippingAddress: { ...address },
      status: 'confirmed',
      createdAt: new Date(),
    };

    this._orders.set([order, ...this._orders()]);
    this.persist();

    return of(order).pipe(delay(300));
  }

  getOrderById(id: string): Observable<Order | undefined> {
    const order = this._orders().find((o) => o.id === id);
    return of(order).pipe(delay(80));
  }

  private generateId(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = 'COB-';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  private persist(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._orders()));
    } catch {
      // no-op
    }
  }

  private loadFromStorage(): Order[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      const orders = JSON.parse(raw) as Order[];
      return orders.map((o) => ({
        ...o,
        createdAt: new Date(o.createdAt),
      }));
    } catch {
      return [];
    }
  }
}
