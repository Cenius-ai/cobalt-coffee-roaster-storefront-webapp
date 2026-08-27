import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    @if (loading()) {
      <div class="detail-page">
        <div class="container detail-skeleton">
          <div class="skeleton-visual"></div>
          <div class="skeleton-info">
            <div class="skeleton-line short"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line medium"></div>
            <div class="skeleton-line medium"></div>
          </div>
        </div>
      </div>
    }

    @if (!loading() && product()) {
      <div class="detail-page">
        <div class="container">
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a routerLink="/shop">Shop</a>
            <span class="sep">/</span>
            <span>{{ product()!.origin }}</span>
            <span class="sep">/</span>
            <span class="current">{{ product()!.name }}</span>
          </nav>

          <div class="detail-layout">
            <!-- VISUAL -->
            <div class="detail-visual">
              <div class="visual-frame">
                <span class="visual-initial">{{ product()!.origin.charAt(0) }}</span>
              </div>
            </div>

            <!-- INFO -->
            <div class="detail-info">
              <div class="tags">
                <span class="tag tag-origin">{{ product()!.origin }}</span>
                <span class="tag tag-roast">{{ product()!.roastLevel }}</span>
                <span class="tag tag-category">{{ product()!.category | titlecase }}</span>
              </div>

              <h1>{{ product()!.name }}</h1>

              <!-- Rating -->
              <div class="rating">
                @for (i of [1,2,3,4,5]; track i) {
                  <svg width="16" height="16" viewBox="0 0 24 24" [attr.fill]="i <= product()!.rating ? 'var(--color-accent)' : 'var(--color-border)'" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"/>
                  </svg>
                }
                <span class="rating-value">{{ product()!.rating }}</span>
              </div>

              <p class="description">{{ product()!.description }}</p>

              <!-- Specs -->
              <div class="specs">
                <div class="spec">
                  <span class="spec-label">Process</span>
                  <span class="spec-value">{{ product()!.process | titlecase }}</span>
                </div>
                <div class="spec">
                  <span class="spec-label">Altitude</span>
                  <span class="spec-value">{{ product()!.altitude }}</span>
                </div>
                <div class="spec">
                  <span class="spec-label">Roast</span>
                  <span class="spec-value">{{ product()!.roastLevel | titlecase }}</span>
                </div>
              </div>

              <!-- Flavour notes -->
              <div class="flavour-section">
                <h6>Tasting notes</h6>
                <div class="flavour-chips">
                  @for (note of product()!.flavorNotes; track note) {
                    <span class="flavour-chip">{{ note }}</span>
                  }
                </div>
              </div>

              <!-- Price & Add -->
              <div class="buy-section">
                <div class="price-block">
                  <span class="price">&#36;{{ (product()!.price / 100) | number:'1.2-2' }}</span>
                  @if (product()!.stock <= 10 && product()!.stock > 0) {
                    <span class="low-stock">Only {{ product()!.stock }} left</span>
                  }
                  @if (product()!.stock === 0) {
                    <span class="sold-out">Sold out</span>
                  }
                </div>

                <div class="buy-controls">
                  <div class="qty-control">
                    <button (click)="decrementQty()" [disabled]="quantity() <= 1" aria-label="Decrease quantity">&minus;</button>
                    <span class="qty-value">{{ quantity() }}</span>
                    <button (click)="incrementQty()" [disabled]="quantity() >= product()!.stock" aria-label="Increase quantity">+</button>
                  </div>
                  <button
                    class="btn-add"
                    (click)="addToCart()"
                    [disabled]="product()!.stock === 0"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Related -->
          @if (relatedProducts().length > 0) {
            <section class="related">
              <h2>You might also like</h2>
              <div class="related-grid">
                @for (rp of relatedProducts(); track rp.id) {
                  <a [routerLink]="['/product', rp.id]" class="related-card">
                    <div class="rc-visual">
                      <span class="rc-initial">{{ rp.origin.charAt(0) }}</span>
                    </div>
                    <div class="rc-body">
                      <span class="rc-origin">{{ rp.origin }}</span>
                      <h6>{{ rp.name }}</h6>
                      <span class="rc-price">&#36;{{ (rp.price / 100) | number:'1.2-2' }}</span>
                    </div>
                  </a>
                }
              </div>
            </section>
          }
        </div>
      </div>
    }

    @if (!loading() && !product()) {
      <div class="detail-page">
        <div class="container not-found">
          <h2>Product not found</h2>
          <p>This coffee may no longer be available.</p>
          <a routerLink="/shop" class="btn-primary">Browse the collection</a>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .detail-page {
        padding: var(--s-6) 0 var(--s-16);
      }

      /* ---- BREADCRUMB ---- */
      .breadcrumb {
        font-size: var(--fs-sm);
        color: var(--color-muted);
        margin-bottom: var(--s-8);
      }

      .breadcrumb a {
        color: var(--color-muted);
        text-decoration: none;
      }

      .breadcrumb a:hover {
        color: var(--color-accent);
      }

      .breadcrumb .sep {
        margin: 0 var(--s-2);
        opacity: 0.4;
      }

      .breadcrumb .current {
        color: var(--color-fg);
      }

      /* ---- LAYOUT ---- */
      .detail-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--s-12);
        align-items: start;
      }

      .detail-visual {
        position: sticky;
        top: 80px;
      }

      .visual-frame {
        aspect-ratio: 1;
        background: var(--color-surface);
        border-radius: var(--r-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-1);
      }

      .visual-initial {
        font-family: var(--font-display);
        font-size: 8rem;
        font-weight: 700;
        color: var(--color-accent);
        opacity: 0.25;
      }

      /* ---- INFO ---- */
      .detail-info {
        display: flex;
        flex-direction: column;
        gap: var(--s-4);
      }

      .tags {
        display: flex;
        gap: var(--s-2);
        flex-wrap: wrap;
      }

      .tag {
        font-size: var(--fs-xs);
        font-weight: 500;
        padding: 3px 12px;
        border-radius: var(--r-full);
        background: var(--color-surface);
      }

      .tag-roast {
        background: var(--brand-50);
        color: var(--brand-700);
      }

      [data-theme="dark"] .tag-roast {
        background: var(--brand-900);
        color: var(--brand-200);
      }

      .tag-category {
        background: var(--color-accent);
        color: var(--color-accent-fg);
        opacity: 0.85;
      }

      .detail-info h1 {
        font-size: var(--fs-4xl);
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .rating-value {
        margin-left: var(--s-2);
        font-weight: 600;
        font-size: var(--fs-sm);
        color: var(--color-fg);
      }

      .description {
        color: var(--color-muted);
        line-height: var(--lh-relaxed);
      }

      /* ---- SPECS ---- */
      .specs {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--s-4);
        padding: var(--s-4);
        background: var(--color-surface);
        border-radius: var(--r-md);
      }

      .spec {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .spec-label {
        font-size: var(--fs-xs);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--color-muted);
      }

      .spec-value {
        font-weight: 600;
        font-size: var(--fs-sm);
      }

      /* ---- FLAVOURS ---- */
      .flavour-section h6 {
        font-family: var(--font-body);
        font-size: var(--fs-xs);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--color-muted);
        margin-bottom: var(--s-3);
      }

      .flavour-chips {
        display: flex;
        gap: var(--s-2);
        flex-wrap: wrap;
      }

      .flavour-chip {
        padding: 6px 14px;
        background: var(--color-surface);
        border-radius: var(--r-full);
        font-size: var(--fs-sm);
        font-weight: 500;
        color: var(--color-fg);
      }

      /* ---- BUY ---- */
      .buy-section {
        padding-top: var(--s-4);
        border-top: 1px solid var(--color-border-light);
        display: flex;
        flex-direction: column;
        gap: var(--s-4);
      }

      .price-block {
        display: flex;
        align-items: baseline;
        gap: var(--s-3);
      }

      .price {
        font-family: var(--font-display);
        font-size: var(--fs-3xl);
        font-weight: 700;
        color: var(--color-accent);
      }

      .low-stock {
        font-size: var(--fs-xs);
        font-weight: 500;
        color: var(--color-warn);
      }

      .sold-out {
        font-size: var(--fs-sm);
        font-weight: 600;
        color: var(--color-danger);
      }

      .buy-controls {
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
        width: 40px;
        height: 44px;
        border: none;
        background: var(--color-surface);
        font-size: 1.2rem;
        font-weight: 500;
        color: var(--color-fg);
        cursor: pointer;
        transition: background var(--dur-1) var(--ease-out);
      }

      .qty-control button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .qty-control button:hover:not(:disabled) {
        background: var(--color-border-light);
      }

      .qty-value {
        width: 44px;
        text-align: center;
        font-weight: 600;
        font-size: var(--fs-base);
      }

      .btn-add {
        flex: 1;
        height: 44px;
        background: var(--color-accent);
        color: var(--color-accent-fg);
        border: none;
        border-radius: var(--r-sm);
        font-weight: 600;
        font-size: var(--fs-sm);
        cursor: pointer;
        transition: background var(--dur-1) var(--ease-out);
      }

      .btn-add:hover:not(:disabled) {
        background: var(--color-accent-hover);
      }

      .btn-add:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* ---- RELATED ---- */
      .related {
        margin-top: var(--s-16);
        padding-top: var(--s-10);
        border-top: 1px solid var(--color-border-light);
      }

      .related h2 {
        font-size: var(--fs-2xl);
        margin-bottom: var(--s-6);
      }

      .related-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: var(--s-4);
      }

      .related-card {
        display: flex;
        flex-direction: column;
        background: var(--color-surface-raised);
        border-radius: var(--r-md);
        box-shadow: var(--shadow-1);
        overflow: hidden;
        text-decoration: none;
        color: inherit;
        transition: box-shadow var(--dur-2) var(--ease-out);
      }

      .related-card:hover {
        box-shadow: var(--shadow-2);
      }

      .rc-visual {
        aspect-ratio: 3 / 2;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-surface);
      }

      .rc-initial {
        font-family: var(--font-display);
        font-size: var(--fs-3xl);
        font-weight: 700;
        color: var(--color-accent);
        opacity: 0.25;
      }

      .rc-body {
        padding: var(--s-3);
      }

      .rc-origin {
        font-size: var(--fs-xs);
        color: var(--color-muted);
      }

      .rc-body h6 {
        font-size: var(--fs-sm);
        margin: var(--s-1) 0;
      }

      .rc-price {
        font-weight: 600;
        font-size: var(--fs-sm);
        color: var(--color-accent);
      }

      /* ---- SKELETON ---- */
      .detail-skeleton {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--s-12);
      }

      .skeleton-visual {
        aspect-ratio: 1;
        background: var(--color-surface);
        border-radius: var(--r-lg);
        animation: pulse 1.5s infinite;
      }

      .skeleton-info {
        display: flex;
        flex-direction: column;
        gap: var(--s-4);
      }

      .skeleton-line {
        height: 18px;
        background: var(--color-surface);
        border-radius: 4px;
        animation: pulse 1.5s infinite;
        width: 100%;
      }

      .skeleton-line.short {
        width: 30%;
      }

      .skeleton-line.medium {
        width: 60%;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }

      /* ---- NOT FOUND ---- */
      .not-found {
        text-align: center;
        padding: var(--s-16) 0;
      }

      .not-found h2 {
        margin-bottom: var(--s-4);
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
        margin-top: var(--s-4);
      }

      /* ---- RESPONSIVE ---- */
      @media (max-width: 960px) {
        .detail-layout {
          grid-template-columns: 1fr;
          gap: var(--s-8);
        }

        .detail-visual {
          position: static;
        }

        .related-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 640px) {
        .specs {
          grid-template-columns: repeat(2, 1fr);
        }
        .buy-controls {
          flex-direction: column;
        }
        .btn-add {
          width: 100%;
        }
      }
    `,
  ],
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | undefined>(undefined);
  loading = signal(true);
  quantity = signal(1);
  relatedProducts = signal<Product[]>([]);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (isNaN(id)) {
        this.loading.set(false);
        return;
      }

      this.loading.set(true);
      this.quantity.set(1);

      this.productService.getProductById(id).subscribe((p) => {
        this.product.set(p);
        this.loading.set(false);

        if (p) {
          // Load related products (same origin or roast level)
          this.productService
            .getProducts({ origin: p.origin, sortBy: 'rating' })
            .subscribe((related) => {
              this.relatedProducts.set(
                related.filter((r) => r.id !== p.id).slice(0, 4)
              );
            });
        }
      });
    });
  }

  incrementQty(): void {
    const p = this.product();
    if (p && this.quantity() < p.stock) {
      this.quantity.set(this.quantity() + 1);
    }
  }

  decrementQty(): void {
    if (this.quantity() > 1) {
      this.quantity.set(this.quantity() - 1);
    }
  }

  addToCart(): void {
    const p = this.product();
    if (p) {
      this.cartService.addItem(p, this.quantity());
      this.quantity.set(1);
    }
  }
}
