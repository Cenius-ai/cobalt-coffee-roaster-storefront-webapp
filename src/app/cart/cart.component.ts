import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../core/services/cart.service';
import { CartItem } from '../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-page">
      <div class="container">
        <header class="cart-header">
          <h1>Shopping Cart</h1>
          @if (!cartService.isEmpty()) {
            <p class="cart-count">{{ cartService.itemCount() }} item(s)</p>
          }
        </header>

        <!-- EMPTY -->
        @if (cartService.isEmpty()) {
          <div class="empty-state">
            <div class="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h3>Your cart is empty</h3>
            <p>Time to explore the collection and find your next favourite roast.</p>
            <a routerLink="/shop" class="btn-primary">Browse coffees</a>
          </div>
        }

        <!-- CART CONTENT -->
        @if (!cartService.isEmpty()) {
          <div class="cart-layout">
            <div class="cart-items">
              @for (item of cartService.items(); track item.productId) {
                <div class="cart-item">
                  <div class="item-visual">
                    <span class="item-initial">{{ item.product.origin.charAt(0) }}</span>
                  </div>
                  <div class="item-info">
                    <div class="item-header">
                      <h3>
                        <a [routerLink]="['/product', item.productId]">{{ item.product.name }}</a>
                      </h3>
                      <span class="item-price">&#36;{{ (item.product.price / 100) | number:'1.2-2' }}</span>
                    </div>
                    <p class="item-origin">{{ item.product.origin }} · {{ item.product.roastLevel | titlecase }} Roast</p>
                    <div class="item-controls">
                      <div class="qty-control">
                        <button (click)="decrementQty(item)" [disabled]="item.quantity <= 1" aria-label="Decrease">&minus;</button>
                        <span>{{ item.quantity }}</span>
                        <button (click)="incrementQty(item)" [disabled]="item.quantity >= item.product.stock" aria-label="Increase">+</button>
                      </div>
                      <button class="btn-remove" (click)="removeItem(item)" [attr.aria-label]="'Remove ' + item.product.name">
                        Remove
                      </button>
                    </div>
                    <span class="item-line-total">&#36;{{ (item.product.price * item.quantity / 100) | number:'1.2-2' }}</span>
                  </div>
                </div>
              }
            </div>

            <!-- SUMMARY -->
            <aside class="cart-summary">
              <div class="summary-card">
                <h4>Order Summary</h4>
                <div class="summary-row">
                  <span>Subtotal ({{ cartService.itemCount() }} items)</span>
                  <span>&#36;{{ (cartService.subtotal() / 100) | number:'1.2-2' }}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping</span>
                  @if (cartService.subtotal() >= 5000) {
                    <span class="free">Free</span>
                  } @else {
                    <span>$4.99</span>
                  }
                </div>
                <div class="summary-divider"></div>
                <div class="summary-row total">
                  <span>Total</span>
                  <span>&#36;{{ (computeTotal() / 100) | number:'1.2-2' }}</span>
                </div>
                @if (cartService.subtotal() < 5000) {
                  <p class="free-shipping-hint">
                    Add &#36;{{ ((5000 - cartService.subtotal()) / 100) | number:'1.2-2' }} more for free shipping
                  </p>
                }
                <a routerLink="/checkout" class="btn-checkout">Proceed to checkout</a>
                <a routerLink="/shop" class="continue-link">Continue shopping</a>
              </div>
            </aside>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .cart-page {
        padding: var(--s-10) 0 var(--s-16);
      }

      .cart-header {
        margin-bottom: var(--s-8);
      }

      .cart-header h1 {
        margin-bottom: var(--s-2);
      }

      .cart-count {
        color: var(--color-muted);
      }

      /* ---- EMPTY ---- */
      .empty-state {
        text-align: center;
        padding: var(--s-16) var(--s-4);
      }

      .empty-icon {
        color: var(--color-muted);
        margin-bottom: var(--s-6);
        opacity: 0.5;
      }

      .empty-state h3 {
        margin-bottom: var(--s-2);
      }

      .empty-state p {
        color: var(--color-muted);
        margin-bottom: var(--s-6);
      }

      .btn-primary {
        display: inline-flex;
        padding: var(--s-3) var(--s-6);
        background: var(--color-accent);
        color: var(--color-accent-fg);
        font-weight: 600;
        font-size: var(--fs-sm);
        border-radius: var(--r-sm);
        text-decoration: none;
      }

      /* ---- LAYOUT ---- */
      .cart-layout {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: var(--s-8);
        align-items: start;
      }

      /* ---- ITEMS ---- */
      .cart-items {
        display: flex;
        flex-direction: column;
        gap: var(--s-4);
      }

      .cart-item {
        display: flex;
        gap: var(--s-5);
        padding: var(--s-5);
        background: var(--color-surface-raised);
        border-radius: var(--r-md);
        box-shadow: var(--shadow-1);
      }

      .item-visual {
        width: 100px;
        height: 100px;
        flex-shrink: 0;
        background: var(--color-surface);
        border-radius: var(--r-sm);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .item-initial {
        font-family: var(--font-display);
        font-size: var(--fs-3xl);
        font-weight: 700;
        color: var(--color-accent);
        opacity: 0.3;
      }

      .item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--s-2);
      }

      .item-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: var(--s-4);
      }

      .item-header h3 {
        font-size: var(--fs-base);
      }

      .item-header a {
        color: var(--color-fg-emphasis);
        text-decoration: none;
      }

      .item-header a:hover {
        color: var(--color-accent);
      }

      .item-price {
        font-weight: 600;
        font-size: var(--fs-sm);
        white-space: nowrap;
      }

      .item-origin {
        font-size: var(--fs-xs);
        color: var(--color-muted);
        margin: 0;
      }

      .item-controls {
        display: flex;
        gap: var(--s-3);
        align-items: center;
      }

      .qty-control {
        display: flex;
        align-items: center;
        border: 1px solid var(--color-border);
        border-radius: var(--r-sm);
        overflow: hidden;
      }

      .qty-control button {
        width: 32px;
        height: 32px;
        border: none;
        background: var(--color-surface);
        font-size: 1rem;
        color: var(--color-fg);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background var(--dur-1) var(--ease-out);
      }

      .qty-control button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .qty-control button:hover:not(:disabled) {
        background: var(--color-border-light);
      }

      .qty-control span {
        width: 36px;
        text-align: center;
        font-weight: 600;
        font-size: var(--fs-sm);
      }

      .btn-remove {
        background: none;
        border: none;
        font-size: var(--fs-xs);
        font-weight: 500;
        color: var(--color-danger);
        cursor: pointer;
        padding: 4px 8px;
        transition: opacity var(--dur-1) var(--ease-out);
      }

      .btn-remove:hover {
        opacity: 0.7;
      }

      .item-line-total {
        font-weight: 600;
        font-size: var(--fs-sm);
        text-align: right;
        color: var(--color-accent);
      }

      /* ---- SUMMARY ---- */
      .cart-summary {
        position: sticky;
        top: 80px;
      }

      .summary-card {
        background: var(--color-surface-raised);
        border-radius: var(--r-md);
        box-shadow: var(--shadow-1);
        padding: var(--s-6);
        display: flex;
        flex-direction: column;
        gap: var(--s-3);
      }

      .summary-card h4 {
        font-size: var(--fs-lg);
        margin-bottom: var(--s-2);
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        font-size: var(--fs-sm);
      }

      .summary-row .free {
        color: var(--color-ok);
        font-weight: 600;
      }

      .summary-divider {
        height: 1px;
        background: var(--color-border-light);
        margin: var(--s-2) 0;
      }

      .summary-row.total {
        font-weight: 700;
        font-size: var(--fs-lg);
        font-family: var(--font-display);
      }

      .free-shipping-hint {
        font-size: var(--fs-xs);
        color: var(--color-muted);
        margin: 0;
      }

      .btn-checkout {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--s-3);
        background: var(--color-accent);
        color: var(--color-accent-fg);
        font-weight: 600;
        font-size: var(--fs-sm);
        border-radius: var(--r-sm);
        text-decoration: none;
        transition: background var(--dur-1) var(--ease-out);
      }

      .btn-checkout:hover {
        background: var(--color-accent-hover);
      }

      .continue-link {
        text-align: center;
        font-size: var(--fs-sm);
        font-weight: 500;
        color: var(--color-muted);
      }

      /* ---- RESPONSIVE ---- */
      @media (max-width: 860px) {
        .cart-layout {
          grid-template-columns: 1fr;
        }

        .cart-summary {
          position: static;
        }
      }

      @media (max-width: 500px) {
        .cart-item {
          flex-direction: column;
        }

        .item-visual {
          width: 100%;
          height: 80px;
        }

        .item-header {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class CartComponent {
  readonly cartService = inject(CartService);

  computeTotal(): number {
    const subtotal = this.cartService.subtotal();
    return subtotal >= 5000 ? subtotal : subtotal + 499;
  }

  incrementQty(item: CartItem): void {
    this.cartService.updateQuantity(item.productId, item.quantity + 1);
  }

  decrementQty(item: CartItem): void {
    this.cartService.updateQuantity(item.productId, item.quantity - 1);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.productId);
  }
}
