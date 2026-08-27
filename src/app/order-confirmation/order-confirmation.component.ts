import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Order } from '../core/models/order.model';
import { OrderService } from '../core/services/order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="confirmation-page">
      <div class="container">
        @if (loading()) {
          <div class="loading">
            <div class="skeleton-line short"></div>
            <div class="skeleton-line medium"></div>
          </div>
        }

        @if (!loading() && order()) {
          <div class="confirmation-card">
            <div class="check-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>

            <h1>Order confirmed!</h1>
            <p class="order-id">Order <strong>{{ order()!.id }}</strong></p>
            <p class="thank-you">
              Thank you, {{ order()!.shippingAddress.name }}. Your coffee is being roasted
              fresh and will ship within 24 hours.
            </p>

            <div class="order-details">
              <div class="detail-section">
                <h3>Shipping to</h3>
                <p>
                  {{ order()!.shippingAddress.name }}<br />
                  {{ order()!.shippingAddress.address }}<br />
                  {{ order()!.shippingAddress.city }}, {{ order()!.shippingAddress.zip }}
                </p>
              </div>

              <div class="detail-section">
                <h3>Order summary</h3>
                <div class="order-items">
                  @for (item of order()!.items; track item.productId) {
                    <div class="order-item">
                      <span>{{ item.product.name }} &times; {{ item.quantity }}</span>
                      <span>&#36;{{ (item.product.price * item.quantity / 100) | number:'1.2-2' }}</span>
                    </div>
                  }
                </div>
                <div class="order-totals">
                  <div class="ot-row">
                    <span>Subtotal</span>
                    <span>&#36;{{ (order()!.subtotal / 100) | number:'1.2-2' }}</span>
                  </div>
                  <div class="ot-row">
                    <span>Shipping</span>
                    @if (order()!.shippingCost === 0) {
                      <span class="free">Free</span>
                    } @else {
                      <span>&#36;{{ (order()!.shippingCost / 100) | number:'1.2-2' }}</span>
                    }
                  </div>
                  <div class="ot-divider"></div>
                  <div class="ot-row total">
                    <span>Total</span>
                    <span>&#36;{{ (order()!.total / 100) | number:'1.2-2' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="confirmation-actions">
              <a routerLink="/shop" class="btn-primary">Continue shopping</a>
            </div>
          </div>
        }

        @if (!loading() && !order()) {
          <div class="not-found">
            <h2>Order not found</h2>
            <p>We couldn't find that order. It may have expired.</p>
            <a routerLink="/shop" class="btn-primary">Back to shop</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .confirmation-page {
        padding: var(--s-10) 0 var(--s-16);
        display: flex;
        justify-content: center;
      }

      .loading {
        display: flex;
        flex-direction: column;
        gap: var(--s-4);
        align-items: center;
        padding: var(--s-16);
      }

      .skeleton-line {
        height: 20px;
        background: var(--color-surface);
        border-radius: 4px;
        animation: pulse 1.5s infinite;
      }

      .skeleton-line.short {
        width: 200px;
      }

      .skeleton-line.medium {
        width: 300px;
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.4;
        }
      }

      .confirmation-card {
        max-width: 640px;
        margin: 0 auto;
        background: var(--color-surface-raised);
        border-radius: var(--r-lg);
        box-shadow: var(--shadow-2);
        padding: var(--s-12);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--s-4);
      }

      .check-icon {
        color: var(--color-ok);
        margin-bottom: var(--s-2);
      }

      .confirmation-card h1 {
        font-size: var(--fs-4xl);
      }

      .order-id {
        font-size: var(--fs-sm);
        color: var(--color-muted);
      }

      .thank-you {
        color: var(--color-muted);
        max-width: 400px;
        margin: 0 auto;
      }

      .order-details {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--s-6);
        text-align: left;
        margin-top: var(--s-4);
        padding-top: var(--s-6);
        border-top: 1px solid var(--color-border-light);
      }

      .detail-section h3 {
        font-family: var(--font-body);
        font-size: var(--fs-xs);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--color-muted);
        margin-bottom: var(--s-3);
      }

      .detail-section p {
        font-size: var(--fs-sm);
        line-height: var(--lh-snug);
        margin: 0;
      }

      .order-items {
        display: flex;
        flex-direction: column;
        gap: var(--s-2);
      }

      .order-item {
        display: flex;
        justify-content: space-between;
        font-size: var(--fs-sm);
      }

      .order-totals {
        margin-top: var(--s-3);
        display: flex;
        flex-direction: column;
        gap: var(--s-2);
      }

      .ot-row {
        display: flex;
        justify-content: space-between;
        font-size: var(--fs-sm);
      }

      .ot-row .free {
        color: var(--color-ok);
        font-weight: 600;
      }

      .ot-divider {
        height: 1px;
        background: var(--color-border-light);
        margin: var(--s-1) 0;
      }

      .ot-row.total {
        font-weight: 700;
        font-size: var(--fs-base);
        font-family: var(--font-display);
      }

      .confirmation-actions {
        margin-top: var(--s-4);
        padding-top: var(--s-4);
        width: 100%;
        border-top: 1px solid var(--color-border-light);
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
        transition: background var(--dur-1) var(--ease-out);
      }

      .btn-primary:hover {
        background: var(--color-accent-hover);
      }

      .not-found {
        text-align: center;
        padding: var(--s-16) 0;
      }

      .not-found h2 {
        margin-bottom: var(--s-4);
      }

      /* ---- RESPONSIVE ---- */
      @media (max-width: 600px) {
        .confirmation-card {
          padding: var(--s-6);
        }

        .order-details {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  order = signal<Order | undefined>(undefined);
  loading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.loading.set(false);
        return;
      }

      this.orderService.getOrderById(id).subscribe((order) => {
        this.order.set(order);
        this.loading.set(false);
      });
    });
  }
}
