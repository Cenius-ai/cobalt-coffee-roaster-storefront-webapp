import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../core/services/cart.service';
import { OrderService } from '../core/services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="checkout-page">
      <div class="container">
        <header class="checkout-header">
          <h1>Checkout</h1>
        </header>

        @if (cartService.isEmpty()) {
          <div class="empty-state">
            <h3>Nothing to check out</h3>
            <p>Add some coffee to your cart first.</p>
            <a routerLink="/shop" class="btn-primary">Browse coffees</a>
          </div>
        }

        @if (!cartService.isEmpty()) {
          <div class="checkout-layout">
            <!-- FORM -->
            <form class="checkout-form" (ngSubmit)="submitOrder()" #f="ngForm">
              <h2>Shipping details</h2>

              <div class="form-group">
                <label for="name">Full name <span class="required">*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  [(ngModel)]="shipping.name"
                  required
                  placeholder="Your full name"
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="address">Address <span class="required">*</span></label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  [(ngModel)]="shipping.address"
                  required
                  placeholder="Street address"
                  class="form-input"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="city">City <span class="required">*</span></label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    [(ngModel)]="shipping.city"
                    required
                    placeholder="City"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label for="zip">ZIP Code <span class="required">*</span></label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    [(ngModel)]="shipping.zip"
                    required
                    placeholder="ZIP"
                    class="form-input"
                  />
                </div>
              </div>

              <h2>Payment</h2>
              <div class="mock-payment">
                <p class="mock-hint">
                  <strong>Demo checkout — no real payment.</strong> Use test card:
                  <code>4242 4242 4242 4242</code>
                </p>
                <div class="form-group">
                  <label for="card">Card number</label>
                  <input
                    type="text"
                    id="card"
                    name="card"
                    [(ngModel)]="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    class="form-input"
                    maxlength="19"
                  />
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="expiry">Expiry</label>
                    <input
                      type="text"
                      id="expiry"
                      name="expiry"
                      [(ngModel)]="cardExpiry"
                      placeholder="MM/YY"
                      class="form-input"
                      maxlength="5"
                    />
                  </div>
                  <div class="form-group">
                    <label for="cvc">CVC</label>
                    <input
                      type="text"
                      id="cvc"
                      name="cvc"
                      [(ngModel)]="cardCvc"
                      placeholder="123"
                      class="form-input"
                      maxlength="4"
                    />
                  </div>
                </div>
              </div>

              <!-- ERRORS -->
              @if (submitError()) {
                <div class="error-msg">{{ submitError() }}</div>
              }

              <button
                type="submit"
                class="btn-place-order"
                [disabled]="submitting()"
              >
                @if (submitting()) {
                  Processing...
                } @else {
                  Place order
                }
              </button>
            </form>

            <!-- SUMMARY -->
            <aside class="checkout-summary">
              <div class="summary-card">
                <h4>Order Summary</h4>
                <div class="summary-items">
                  @for (item of cartService.items(); track item.productId) {
                    <div class="summary-item">
                      <div class="si-info">
                        <span class="si-name">{{ item.product.name }}</span>
                        <span class="si-qty">&times;{{ item.quantity }}</span>
                      </div>
                      <span class="si-price">&#36;{{ (item.product.price * item.quantity / 100) | number:'1.2-2' }}</span>
                    </div>
                  }
                </div>
                <div class="summary-divider"></div>
                <div class="summary-row">
                  <span>Subtotal</span>
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
              </div>
            </aside>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .checkout-page {
        padding: var(--s-10) 0 var(--s-16);
      }

      .checkout-header {
        margin-bottom: var(--s-8);
      }

      .empty-state {
        text-align: center;
        padding: var(--s-16) var(--s-4);
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
      .checkout-layout {
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: var(--s-8);
        align-items: start;
      }

      /* ---- FORM ---- */
      .checkout-form {
        background: var(--color-surface-raised);
        border-radius: var(--r-md);
        box-shadow: var(--shadow-1);
        padding: var(--s-8);
        display: flex;
        flex-direction: column;
        gap: var(--s-5);
      }

      .checkout-form h2 {
        font-size: var(--fs-xl);
        margin-bottom: 0;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--s-1);
        flex: 1;
      }

      .form-group label {
        font-size: var(--fs-sm);
        font-weight: 500;
      }

      .required {
        color: var(--color-danger);
      }

      .form-input {
        padding: 10px 14px;
        border: 1px solid var(--color-border);
        border-radius: var(--r-sm);
        background: var(--color-bg);
        font-family: var(--font-body);
        font-size: var(--fs-base);
        color: var(--color-fg);
        transition: border-color var(--dur-1) var(--ease-out);
      }

      .form-input:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: 0 0 0 3px oklch(0.58 0.17 148 / 0.12);
      }

      .form-input::placeholder {
        color: var(--color-muted);
      }

      .form-row {
        display: flex;
        gap: var(--s-4);
      }

      .mock-payment {
        background: var(--color-surface);
        border-radius: var(--r-md);
        padding: var(--s-5);
        display: flex;
        flex-direction: column;
        gap: var(--s-4);
      }

      .mock-hint {
        font-size: var(--fs-sm);
        color: var(--color-muted);
        margin: 0;
      }

      .mock-hint code {
        background: var(--color-bg);
        padding: 2px 8px;
        border-radius: 4px;
        font-size: var(--fs-sm);
      }

      .error-msg {
        padding: var(--s-3) var(--s-4);
        background: oklch(0.58 0.20 25 / 0.1);
        color: var(--color-danger);
        border-radius: var(--r-sm);
        font-size: var(--fs-sm);
        font-weight: 500;
      }

      .btn-place-order {
        width: 100%;
        padding: var(--s-3) var(--s-6);
        background: var(--color-accent);
        color: var(--color-accent-fg);
        border: none;
        border-radius: var(--r-sm);
        font-weight: 600;
        font-size: var(--fs-base);
        cursor: pointer;
        transition: background var(--dur-1) var(--ease-out);
        height: 48px;
      }

      .btn-place-order:hover:not(:disabled) {
        background: var(--color-accent-hover);
      }

      .btn-place-order:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      /* ---- SUMMARY ---- */
      .checkout-summary {
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

      .summary-items {
        display: flex;
        flex-direction: column;
        gap: var(--s-3);
      }

      .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--s-3);
      }

      .si-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .si-name {
        font-size: var(--fs-sm);
        font-weight: 500;
      }

      .si-qty {
        font-size: var(--fs-xs);
        color: var(--color-muted);
      }

      .si-price {
        font-size: var(--fs-sm);
        font-weight: 600;
        white-space: nowrap;
      }

      .summary-divider {
        height: 1px;
        background: var(--color-border-light);
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

      .summary-row.total {
        font-weight: 700;
        font-size: var(--fs-lg);
        font-family: var(--font-display);
      }

      /* ---- RESPONSIVE ---- */
      @media (max-width: 860px) {
        .checkout-layout {
          grid-template-columns: 1fr;
        }

        .checkout-summary {
          position: static;
        }
      }

      @media (max-width: 500px) {
        .form-row {
          flex-direction: column;
        }

        .checkout-form {
          padding: var(--s-5);
        }
      }
    `,
  ],
})
export class CheckoutComponent {
  private router = inject(Router);
  readonly cartService = inject(CartService);
  private orderService = inject(OrderService);

  shipping = { name: '', address: '', city: '', zip: '' };
  cardNumber = '';
  cardExpiry = '';
  cardCvc = '';

  submitting = signal(false);
  submitError = signal<string | null>(null);

  computeTotal(): number {
    const subtotal = this.cartService.subtotal();
    return subtotal >= 5000 ? subtotal : subtotal + 499;
  }

  submitOrder(): void {
    if (this.submitting()) return;

    if (
      !this.shipping.name ||
      !this.shipping.address ||
      !this.shipping.city ||
      !this.shipping.zip
    ) {
      this.submitError.set('Please fill in all shipping fields.');
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    this.orderService
      .placeOrder(this.cartService.items(), {
        name: this.shipping.name,
        address: this.shipping.address,
        city: this.shipping.city,
        zip: this.shipping.zip,
      })
      .subscribe({
        next: (order) => {
          this.cartService.clear();
          this.router.navigate(['/order-confirmation', order.id]);
        },
        error: () => {
          this.submitting.set(false);
          this.submitError.set('Something went wrong. Please try again.');
        },
      });
  }
}
