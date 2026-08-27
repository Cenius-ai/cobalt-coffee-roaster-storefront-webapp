import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../core/models/product.model';
import { ProductService } from '../core/services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- HERO -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-content">
          <p class="hero-eyebrow">Specialty Coffee Roasters</p>
          <h1 class="hero-title">
            Coffee that<br /><em>means</em> something.
          </h1>
          <p class="hero-body">
            Every bean we source supports the farmer who grew it, the land it came
            from, and the craft of roasting. No shortcuts — just extraordinary coffee,
            delivered fresh.
          </p>
          <div class="hero-actions">
            <a routerLink="/shop" class="btn-primary">Browse the collection</a>
            <a routerLink="/shop" class="btn-ghost">Learn more &darr;</a>
          </div>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <div class="hero-gradient"></div>
        </div>
      </div>
    </section>

    <!-- FEATURED PRODUCTS -->
    <section class="featured">
      <div class="container">
        <div class="section-header">
          <h2>This season's highlights</h2>
          <a routerLink="/shop" class="view-all">View all &rarr;</a>
        </div>
        <div class="featured-grid">
          @for (product of featuredProducts; track product.id) {
            <a
              [routerLink]="['/product', product.id]"
              class="featured-card"
            >
              <div class="card-visual" [class]="originClass(product.origin)">
                <span class="card-initial">{{ product.origin.charAt(0) }}</span>
              </div>
              <div class="card-body">
                <div class="card-tags">
                  <span class="tag tag-origin">{{ product.origin }}</span>
                  <span class="tag tag-roast">{{ product.roastLevel }}</span>
                </div>
                <h3 class="card-title">{{ product.name }}</h3>
                <p class="card-notes">
                  @for (note of product.flavorNotes.slice(0, 3); track note; let last = $last) {
                    {{ note }}@if (!last) {, }
                  }
                </p>
                <span class="card-price">&#36;{{ (product.price / 100) | number:'1.2-2' }}</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- VALUE PROPS -->
    <section class="values">
      <div class="container values-inner">
        <div class="value-item">
          <div class="value-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h5>Ethically Sourced</h5>
          <p>Direct trade relationships with growers — fair prices, transparent supply chains.</p>
        </div>
        <div class="value-item">
          <div class="value-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h5>Roasted to Order</h5>
          <p>Small batches, roasted daily. Your coffee ships within 24 hours of roasting.</p>
        </div>
        <div class="value-item">
          <div class="value-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 22l10-5 10 5"/><path d="M12 2v15"/><path d="M4.5 7.5L12 11l7.5-3.5"/><path d="M12 2L4.5 5.5 12 11l7.5-5.5L12 2z"/>
            </svg>
          </div>
          <h5>Free Shipping Over $50</h5>
          <p>Complimentary delivery on orders above fifty dollars. Fresh coffee, your door.</p>
        </div>
      </div>
    </section>

    <!-- ORIGIN SPOTLIGHT -->
    <section class="spotlight">
      <div class="container spotlight-inner">
        <div class="spotlight-visual" aria-hidden="true">
          <div class="spotlight-gradient"></div>
        </div>
        <div class="spotlight-content">
          <p class="hero-eyebrow">Origin Spotlight</p>
          <h2>Ethiopia Yirgacheffe</h2>
          <p>
            Nestled in the Gedeo Zone of southern Ethiopia, the Yirgacheffe region
            is widely regarded as the birthplace of coffee. High altitudes, rich
            volcanic soil, and meticulous washed processing yield a cup of
            extraordinary clarity — jasmine, stone fruit, and bergamot in perfect
            balance.
          </p>
          <a [routerLink]="['/product', 1]" class="btn-primary">Taste it &rarr;</a>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      /* ---- HERO ---- */
      .hero {
        padding: var(--s-20) 0 var(--s-16);
        overflow: hidden;
      }

      .hero-inner {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--s-12);
        align-items: center;
      }

      .hero-content {
        max-width: 560px;
      }

      .hero-eyebrow {
        font-family: var(--font-body);
        font-size: var(--fs-xs);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-accent);
        margin-bottom: var(--s-4);
      }

      .hero-title {
        font-size: var(--fs-6xl);
        line-height: 1.05;
        margin-bottom: var(--s-6);
      }

      .hero-title em {
        font-style: italic;
        color: var(--color-accent);
      }

      .hero-body {
        font-size: var(--fs-lg);
        color: var(--color-muted);
        max-width: 480px;
        margin-bottom: var(--s-8);
      }

      .hero-actions {
        display: flex;
        gap: var(--s-4);
        flex-wrap: wrap;
      }

      .btn-primary {
        display: inline-flex;
        align-items: center;
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

      .btn-ghost {
        display: inline-flex;
        align-items: center;
        padding: var(--s-3) var(--s-6);
        color: var(--color-fg);
        font-weight: 500;
        font-size: var(--fs-sm);
        border-radius: var(--r-sm);
        text-decoration: none;
        transition: background var(--dur-1) var(--ease-out);
      }

      .btn-ghost:hover {
        background: var(--color-surface);
      }

      .hero-visual {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .hero-gradient {
        width: 100%;
        aspect-ratio: 1;
        max-width: 480px;
        border-radius: var(--r-lg);
        background: linear-gradient(
          135deg,
          oklch(0.58 0.17 148 / 0.15),
          oklch(0.58 0.17 148 / 0.05)
        );
        position: relative;
        overflow: hidden;
      }

      .hero-gradient::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(
          circle at 60% 40%,
          oklch(0.58 0.17 148 / 0.25),
          transparent 60%
        );
      }

      /* ---- FEATURED ---- */
      .featured {
        padding: var(--s-12) 0;
      }

      .section-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: var(--s-8);
      }

      .section-header h2 {
        font-size: var(--fs-4xl);
      }

      .view-all {
        font-weight: 500;
        font-size: var(--fs-sm);
        white-space: nowrap;
      }

      .featured-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--s-6);
      }

      .featured-card {
        display: flex;
        flex-direction: column;
        background: var(--color-surface-raised);
        border-radius: var(--r-md);
        box-shadow: var(--shadow-1);
        text-decoration: none;
        color: inherit;
        overflow: hidden;
        transition: box-shadow var(--dur-2) var(--ease-out), transform var(--dur-2) var(--ease-out);
      }

      .featured-card:hover {
        box-shadow: var(--shadow-2);
        transform: translateY(-2px);
      }

      .card-visual {
        aspect-ratio: 4 / 3;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-surface);
      }

      .card-initial {
        font-family: var(--font-display);
        font-size: var(--fs-5xl);
        font-weight: 700;
        color: var(--color-accent);
        opacity: 0.35;
      }

      .card-body {
        padding: var(--s-5);
        display: flex;
        flex-direction: column;
        gap: var(--s-2);
        flex: 1;
      }

      .card-tags {
        display: flex;
        gap: var(--s-2);
        flex-wrap: wrap;
      }

      .tag {
        font-size: var(--fs-xs);
        font-weight: 500;
        padding: 2px 10px;
        border-radius: var(--r-full);
        background: var(--color-surface);
        color: var(--color-fg);
      }

      .tag-roast {
        background: var(--brand-50);
        color: var(--brand-700);
      }

      [data-theme="dark"] .tag-roast {
        background: var(--brand-900);
        color: var(--brand-200);
      }

      .card-title {
        font-size: var(--fs-lg);
        margin: 0;
      }

      .card-notes {
        font-size: var(--fs-sm);
        color: var(--color-muted);
        margin: 0;
        line-height: var(--lh-snug);
      }

      .card-price {
        font-family: var(--font-display);
        font-size: var(--fs-xl);
        font-weight: 600;
        color: var(--color-accent);
        margin-top: auto;
        padding-top: var(--s-2);
      }

      /* ---- VALUES ---- */
      .values {
        padding: var(--s-12) 0;
        background: var(--color-surface);
        margin-top: var(--s-8);
      }

      .values-inner {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--s-8);
      }

      .value-item {
        text-align: center;
      }

      .value-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        margin: 0 auto var(--s-4);
        background: var(--color-bg);
        border-radius: var(--r-md);
        color: var(--color-accent);
      }

      .value-item h5 {
        font-size: var(--fs-base);
        margin-bottom: var(--s-2);
      }

      .value-item p {
        font-size: var(--fs-sm);
        color: var(--color-muted);
        max-width: 280px;
        margin: 0 auto;
      }

      /* ---- SPOTLIGHT ---- */
      .spotlight {
        padding: var(--s-16) 0 var(--s-8);
      }

      .spotlight-inner {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--s-12);
        align-items: center;
      }

      .spotlight-visual {
        aspect-ratio: 4 / 3;
        border-radius: var(--r-lg);
        overflow: hidden;
      }

      .spotlight-gradient {
        width: 100%;
        height: 100%;
        background: linear-gradient(
          135deg,
          oklch(0.58 0.17 148 / 0.2),
          oklch(0.97 0.02 148 / 0.5)
        );
      }

      [data-theme="dark"] .spotlight-gradient {
        background: linear-gradient(
          135deg,
          oklch(0.58 0.17 148 / 0.3),
          oklch(0.26 0.07 148 / 0.6)
        );
      }

      .spotlight-content h2 {
        font-size: var(--fs-4xl);
        margin-bottom: var(--s-4);
        margin-top: var(--s-2);
      }

      .spotlight-content p {
        color: var(--color-muted);
        margin-bottom: var(--s-6);
      }

      /* ---- RESPONSIVE ---- */
      @media (max-width: 960px) {
        .hero-inner {
          grid-template-columns: 1fr;
        }
        .hero-visual {
          display: none;
        }
        .hero-title {
          font-size: var(--fs-4xl);
        }
        .featured-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        .values-inner {
          grid-template-columns: 1fr;
          gap: var(--s-6);
        }
        .spotlight-inner {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 640px) {
        .featured-grid {
          grid-template-columns: 1fr;
        }
        .hero {
          padding: var(--s-10) 0;
        }
        .section-header h2 {
          font-size: var(--fs-2xl);
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  originClass(origin: string): string {
    return 'origin-' + origin.toLowerCase().replace(/\s+/g, '-');
  }
  private productService = inject(ProductService);

  featuredProducts: Product[] = [];

  ngOnInit(): void {
    this.productService.getProducts({ sortBy: 'rating' }).subscribe((products) => {
      this.featuredProducts = products.slice(0, 6);
    });
  }
}
