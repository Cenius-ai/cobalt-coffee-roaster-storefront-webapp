import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../core/models/product.model';
import { ProductService, ProductFilters } from '../core/services/product.service';
import { CartService } from '../core/services/cart.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
  ],
  template: `
    <div class="shop-page">
      <div class="container">
        <header class="shop-header">
          <h1>The Collection</h1>
          <p class="shop-subtitle">
            {{ totalCount() }} coffees from around the world
          </p>
        </header>

        <!-- FILTERS BAR -->
        <div class="filters-bar">
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder="Search coffees, origins, flavours..."
              [ngModel]="searchTerm()"
              (ngModelChange)="onSearch($event)"
              class="search-input"
            />
            @if (searchTerm()) {
              <button class="search-clear" (click)="onSearch('')" aria-label="Clear search">&times;</button>
            }
          </div>

          <div class="filter-controls">
            <mat-form-field appearance="outline" class="filter-select">
              <mat-label>Origin</mat-label>
              <mat-select
                [ngModel]="activeOrigin()"
                (ngModelChange)="onOriginChange($event)"
              >
                <mat-option [value]="null">All origins</mat-option>
                @for (origin of origins; track origin) {
                  <mat-option [value]="origin">{{ origin }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-select">
              <mat-label>Roast</mat-label>
              <mat-select
                [ngModel]="activeRoast()"
                (ngModelChange)="onRoastChange($event)"
              >
                <mat-option [value]="null">All roasts</mat-option>
                <mat-option value="light">Light</mat-option>
                <mat-option value="medium">Medium</mat-option>
                <mat-option value="dark">Dark</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-select">
              <mat-label>Category</mat-label>
              <mat-select
                [ngModel]="activeCategory()"
                (ngModelChange)="onCategoryChange($event)"
              >
                <mat-option [value]="null">All categories</mat-option>
                @for (cat of categories; track cat) {
                  <mat-option [value]="cat">{{ cat | titlecase }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-select sort-select">
              <mat-label>Sort by</mat-label>
              <mat-select
                [ngModel]="activeSort()"
                (ngModelChange)="onSortChange($event)"
              >
                <mat-option [value]="null">Featured</mat-option>
                <mat-option value="name">Name</mat-option>
                <mat-option value="price-asc">Price: Low to High</mat-option>
                <mat-option value="price-desc">Price: High to Low</mat-option>
                <mat-option value="rating">Top Rated</mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <!-- Active filter chips -->
          @if (hasActiveFilters()) {
            <div class="active-filters">
              @if (activeOrigin()) {
                <span class="filter-chip">
                  {{ activeOrigin() }}
                  <button (click)="onOriginChange(null)" aria-label="Remove origin filter">&times;</button>
                </span>
              }
              @if (activeRoast()) {
                <span class="filter-chip">
                  {{ activeRoast() | titlecase }}
                  <button (click)="onRoastChange(null)" aria-label="Remove roast filter">&times;</button>
                </span>
              }
              @if (activeCategory()) {
                <span class="filter-chip">
                  {{ activeCategory() | titlecase }}
                  <button (click)="onCategoryChange(null)" aria-label="Remove category filter">&times;</button>
                </span>
              }
              @if (searchTerm()) {
                <span class="filter-chip">
                  "{{ searchTerm() }}"
                  <button (click)="onSearch('')" aria-label="Clear search">&times;</button>
                </span>
              }
              <button class="clear-all" (click)="clearAll()">Clear all</button>
            </div>
          }
        </div>

        <!-- LOADING -->
        @if (loading()) {
          <div class="product-grid">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="skeleton-card">
                <div class="skeleton-visual"></div>
                <div class="skeleton-body">
                  <div class="skeleton-line short"></div>
                  <div class="skeleton-line"></div>
                  <div class="skeleton-line medium"></div>
                </div>
              </div>
            }
          </div>
        }

        <!-- EMPTY -->
        @if (!loading() && products().length === 0) {
          <div class="empty-state">
            <h3>No coffees match your filters</h3>
            <p>Try adjusting the origin, roast level, or search term.</p>
            <button class="btn-secondary" (click)="clearAll()">Reset all filters</button>
          </div>
        }

        <!-- PRODUCT GRID -->
        @if (!loading() && products().length > 0) {
          <div class="product-grid">
            @for (product of products(); track product.id) {
              <a
                [routerLink]="['/product', product.id]"
                class="product-card"
              >
                <div class="card-visual">
                  <span class="card-initial">{{ product.origin.charAt(0) }}</span>
                  @if (product.rating >= 4.5) {
                    <span class="card-badge">Top Rated</span>
                  }
                </div>
                <div class="card-body">
                  <div class="card-tags">
                    <span class="tag tag-origin">{{ product.origin }}</span>
                    <span class="tag tag-roast">{{ product.roastLevel }}</span>
                  </div>
                  <h3 class="card-title">{{ product.name }}</h3>
                  <p class="card-notes">
                    @for (note of product.flavorNotes.slice(0, 3); track note; let last = $last) {
                      {{ note }}@if (!last) { · }
                    }
                  </p>
                  <div class="card-footer">
                    <span class="card-price">&#36;{{ (product.price / 100) | number:'1.2-2' }}</span>
                    <button
                      class="add-btn"
                      (click)="addToCart($event, product)"
                      [disabled]="product.stock === 0"
                      [attr.aria-label]="'Add ' + product.name + ' to cart'"
                    >
                      +
                    </button>
                  </div>
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .shop-page {
        padding: var(--s-10) 0 var(--s-16);
      }

      .shop-header {
        margin-bottom: var(--s-8);
      }

      .shop-header h1 {
        margin-bottom: var(--s-2);
      }

      .shop-subtitle {
        color: var(--color-muted);
      }

      /* ---- FILTERS ---- */
      .filters-bar {
        margin-bottom: var(--s-8);
      }

      .search-box {
        position: relative;
        margin-bottom: var(--s-4);
      }

      .search-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-muted);
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        padding: 12px 40px 12px 44px;
        border: 1px solid var(--color-border);
        border-radius: var(--r-sm);
        background: var(--color-surface-raised);
        font-family: var(--font-body);
        font-size: var(--fs-base);
        color: var(--color-fg);
        transition: border-color var(--dur-1) var(--ease-out);
      }

      .search-input:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: 0 0 0 3px oklch(0.58 0.17 148 / 0.12);
      }

      .search-input::placeholder {
        color: var(--color-muted);
      }

      .search-clear {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 1.2rem;
        color: var(--color-muted);
        cursor: pointer;
        padding: 4px;
        line-height: 1;
      }

      .filter-controls {
        display: flex;
        gap: var(--s-3);
        flex-wrap: wrap;
      }

      .filter-select {
        min-width: 160px;
        flex: 1;
      }

      .sort-select {
        min-width: 180px;
      }

      /* Override Material form field */
      ::ng-deep .filter-select .mat-mdc-form-field-flex {
        background: var(--color-surface-raised);
      }

      ::ng-deep .filter-select .mat-mdc-outline {
        color: var(--color-border);
      }

      .active-filters {
        display: flex;
        gap: var(--s-2);
        flex-wrap: wrap;
        align-items: center;
        margin-top: var(--s-3);
      }

      .filter-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 12px;
        background: var(--color-surface);
        border-radius: var(--r-full);
        font-size: var(--fs-xs);
        font-weight: 500;
      }

      .filter-chip button {
        background: none;
        border: none;
        font-size: 1rem;
        color: var(--color-muted);
        cursor: pointer;
        line-height: 1;
        padding: 0;
      }

      .clear-all {
        background: none;
        border: none;
        font-size: var(--fs-xs);
        font-weight: 500;
        color: var(--color-accent);
        cursor: pointer;
        padding: 4px 8px;
      }

      /* ---- PRODUCT GRID ---- */
      .product-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--s-6);
      }

      .product-card {
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

      .product-card:hover {
        box-shadow: var(--shadow-2);
        transform: translateY(-2px);
      }

      .card-visual {
        aspect-ratio: 4 / 3;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-surface);
        position: relative;
      }

      .card-initial {
        font-family: var(--font-display);
        font-size: var(--fs-5xl);
        font-weight: 700;
        color: var(--color-accent);
        opacity: 0.3;
      }

      .card-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: var(--color-accent);
        color: var(--color-accent-fg);
        font-size: var(--fs-xs);
        font-weight: 600;
        padding: 4px 10px;
        border-radius: var(--r-full);
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

      .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: auto;
        padding-top: var(--s-3);
      }

      .card-price {
        font-family: var(--font-display);
        font-size: var(--fs-xl);
        font-weight: 600;
        color: var(--color-accent);
      }

      .add-btn {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-accent);
        color: var(--color-accent-fg);
        border: none;
        border-radius: var(--r-sm);
        font-size: 1.3rem;
        font-weight: 600;
        cursor: pointer;
        transition: background var(--dur-1) var(--ease-out);
      }

      .add-btn:hover:not(:disabled) {
        background: var(--color-accent-hover);
      }

      .add-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      /* ---- SKELETON ---- */
      .skeleton-card {
        border-radius: var(--r-md);
        overflow: hidden;
        background: var(--color-surface);
      }

      .skeleton-visual {
        aspect-ratio: 4 / 3;
        background: var(--color-border-light);
        animation: pulse 1.5s infinite;
      }

      .skeleton-body {
        padding: var(--s-5);
        display: flex;
        flex-direction: column;
        gap: var(--s-3);
      }

      .skeleton-line {
        height: 14px;
        background: var(--color-border-light);
        border-radius: 4px;
        animation: pulse 1.5s infinite;
        width: 100%;
      }

      .skeleton-line.short {
        width: 40%;
      }

      .skeleton-line.medium {
        width: 70%;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }

      /* ---- EMPTY ---- */
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

      .btn-secondary {
        padding: var(--s-2) var(--s-6);
        background: var(--color-surface);
        color: var(--color-fg);
        border: 1px solid var(--color-border);
        border-radius: var(--r-sm);
        font-weight: 500;
        cursor: pointer;
        font-family: var(--font-body);
        font-size: var(--fs-sm);
      }

      /* ---- RESPONSIVE ---- */
      @media (max-width: 960px) {
        .product-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 640px) {
        .product-grid {
          grid-template-columns: 1fr;
        }
        .filter-controls {
          flex-direction: column;
        }
        .filter-select {
          min-width: 100%;
        }
      }
    `,
  ],
})
export class ShopComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  products = signal<Product[]>([]);
  loading = signal(true);
  totalCount = signal(0);

  searchTerm = signal<string>('');
  activeOrigin = signal<string | null>(null);
  activeRoast = signal<string | null>(null);
  activeCategory = signal<string | null>(null);
  activeSort = signal<string | null>(null);

  origins: string[] = [];
  categories: string[] = [];

  ngOnInit(): void {
    this.productService.getOrigins().subscribe((o) => (this.origins = o));
    this.productService.getCategories().subscribe((c) => (this.categories = c));

    // Read query params for pre-filtered navigation
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.activeCategory.set(params['category']);
      }
      if (params['origin']) {
        this.activeOrigin.set(params['origin']);
      }
      this.loadProducts();
    });

    // Initial load
    this.loadProducts();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.activeOrigin() ||
      this.activeRoast() ||
      this.activeCategory() ||
      this.searchTerm()
    );
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.loadProducts();
  }

  onOriginChange(origin: string | null): void {
    this.activeOrigin.set(origin);
    this.loadProducts();
  }

  onRoastChange(roast: string | null): void {
    this.activeRoast.set(roast);
    this.loadProducts();
  }

  onCategoryChange(cat: string | null): void {
    this.activeCategory.set(cat);
    this.loadProducts();
  }

  onSortChange(sort: string | null): void {
    this.activeSort.set(
      sort as 'name' | 'price-asc' | 'price-desc' | 'rating' | null
    );
    this.loadProducts();
  }

  clearAll(): void {
    this.searchTerm.set('');
    this.activeOrigin.set(null);
    this.activeRoast.set(null);
    this.activeCategory.set(null);
    this.activeSort.set(null);
    this.loadProducts();
  }

  addToCart(event: Event, product: Product): void {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addItem(product, 1);
  }

  private loadProducts(): void {
    this.loading.set(true);
    const filters: ProductFilters = {
      search: this.searchTerm() || null,
      origin: this.activeOrigin(),
      roastLevel: this.activeRoast(),
      category: this.activeCategory(),
      sortBy: this.activeSort() as "name" | "price-asc" | "price-desc" | "rating" | null,
    };
    this.productService.getProducts(filters).subscribe((result) => {
      this.products.set(result);
      this.totalCount.set(result.length);
      this.loading.set(false);
    });
  }
}
