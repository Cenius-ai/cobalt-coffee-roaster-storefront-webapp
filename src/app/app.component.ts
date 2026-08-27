import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from './core/services/cart.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
  ],
  template: `
    <div class="app-shell">
      <!-- HEADER -->
      <header class="site-header">
        <div class="container header-inner">
          <a routerLink="/" class="logo" aria-label="Cobalt Coffee Roasters — Home">
            <span class="logo-mark">&#9679;</span>
            <span class="logo-text">Cobalt</span>
          </a>
          <nav class="nav-links" aria-label="Main navigation">
            <a routerLink="/shop" routerLinkActive="active">Shop</a>
            <a routerLink="/cart" routerLinkActive="active" class="cart-link">
              Cart
              @if (cartService.itemCount() > 0) {
                <span class="cart-badge">{{ cartService.itemCount() }}</span>
              }
            </a>
          </nav>
          <button
            class="theme-toggle-btn"
            (click)="themeService.toggle()"
            [attr.aria-label]="'Switch to ' + (themeService.theme() === 'light' ? 'dark' : 'light') + ' theme'"
          >
            @if (themeService.theme() === 'light') {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            } @else {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            }
          </button>
        </div>
      </header>

      <!-- MAIN CONTENT -->
      <main class="site-main">
        <router-outlet />
      </main>

      <!-- FOOTER -->
      <footer class="site-footer">
        <div class="container footer-inner">
          <div class="footer-brand">
            <span class="footer-logo">Cobalt</span>
            <p>Small-batch specialty coffee, ethically sourced from the world's finest growing regions.</p>
          </div>
          <div class="footer-links">
            <div class="footer-col">
              <h6>Shop</h6>
              <a routerLink="/shop">All Coffee</a>
              <a routerLink="/shop" [queryParams]="{category: 'single-origin'}">Single Origin</a>
              <a routerLink="/shop" [queryParams]="{category: 'blend'}">Blends</a>
              <a routerLink="/shop" [queryParams]="{category: 'espresso'}">Espresso</a>
            </div>
            <div class="footer-col">
              <h6>Info</h6>
              <a routerLink="/shop">Brew Guides</a>
              <a routerLink="/shop">Shipping</a>
              <a routerLink="/shop">Contact</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="container">
            <span>&copy; {{ currentYear }} Cobalt Coffee Roasters. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      .app-shell {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      /* ---- HEADER ---- */
      .site-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: var(--color-surface-raised);
        border-bottom: 1px solid var(--color-border-light);
        backdrop-filter: blur(8px);
      }

      .header-inner {
        display: flex;
        align-items: center;
        gap: var(--s-8);
        padding-top: var(--s-3);
        padding-bottom: var(--s-3);
        height: 64px;
      }

      .logo {
        display: flex;
        align-items: baseline;
        gap: var(--s-2);
        text-decoration: none;
        color: var(--color-fg-emphasis);
        font-family: var(--font-display);
        font-size: var(--fs-2xl);
        font-weight: 700;
        letter-spacing: -0.01em;
        flex-shrink: 0;
      }

      .logo-mark {
        color: var(--color-accent);
        font-size: 1.2em;
      }

      .logo-text {
        line-height: 1;
      }

      .nav-links {
        display: flex;
        gap: var(--s-2);
        margin-left: auto;
      }

      .nav-links a {
        padding: var(--s-2) var(--s-4);
        border-radius: var(--r-sm);
        font-weight: 500;
        font-size: var(--fs-sm);
        color: var(--color-fg);
        text-decoration: none;
        transition: background var(--dur-1) var(--ease-out), color var(--dur-1) var(--ease-out);
      }

      .nav-links a:hover,
      .nav-links a.active {
        background: var(--color-surface);
        color: var(--color-accent);
      }

      .cart-link {
        position: relative;
      }

      .cart-badge {
        position: absolute;
        top: 2px;
        right: 2px;
        background: var(--color-accent);
        color: var(--color-accent-fg);
        font-size: 0.65rem;
        font-weight: 600;
        min-width: 18px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--r-full);
        padding: 0 5px;
      }

      .theme-toggle-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: none;
        background: var(--color-surface);
        border-radius: var(--r-sm);
        color: var(--color-fg);
        cursor: pointer;
        transition: background var(--dur-1) var(--ease-out);
        flex-shrink: 0;
      }

      .theme-toggle-btn:hover {
        background: var(--color-border);
      }

      /* ---- MAIN ---- */
      .site-main {
        flex: 1;
      }

      /* ---- FOOTER ---- */
      .site-footer {
        background: var(--color-surface);
        border-top: 1px solid var(--color-border-light);
        margin-top: var(--s-20);
        padding-top: var(--s-12);
      }

      .footer-inner {
        display: flex;
        gap: var(--s-16);
        padding-bottom: var(--s-10);
        flex-wrap: wrap;
      }

      .footer-brand {
        flex: 2;
        min-width: 240px;
      }

      .footer-logo {
        font-family: var(--font-display);
        font-size: var(--fs-2xl);
        font-weight: 700;
        color: var(--color-fg-emphasis);
      }

      .footer-brand p {
        margin-top: var(--s-3);
        color: var(--color-muted);
        font-size: var(--fs-sm);
        max-width: 320px;
      }

      .footer-links {
        flex: 3;
        display: flex;
        gap: var(--s-16);
        flex-wrap: wrap;
      }

      .footer-col h6 {
        font-family: var(--font-body);
        font-size: var(--fs-xs);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--color-muted);
        margin-bottom: var(--s-3);
      }

      .footer-col a {
        display: block;
        font-size: var(--fs-sm);
        color: var(--color-fg);
        padding: var(--s-1) 0;
        text-decoration: none;
        transition: color var(--dur-1) var(--ease-out);
      }

      .footer-col a:hover {
        color: var(--color-accent);
      }

      .footer-bottom {
        border-top: 1px solid var(--color-border-light);
        padding: var(--s-4) 0;
        font-size: var(--fs-xs);
        color: var(--color-muted);
      }

      /* ---- RESPONSIVE ---- */
      @media (max-width: 640px) {
        .header-inner {
          gap: var(--s-4);
        }

        .nav-links a {
          padding: var(--s-2) var(--s-3);
        }

        .footer-inner {
          flex-direction: column;
          gap: var(--s-8);
        }

        .footer-links {
          gap: var(--s-8);
        }
      }
    `,
  ],
})
export class AppComponent {
  readonly cartService = inject(CartService);
  readonly themeService = inject(ThemeService);
  readonly currentYear = new Date().getFullYear();
}
