import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h2>Page not found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a routerLink="/" class="back-link">Back to home</a>
    </div>
  `,
  styles: [
    `
      .not-found {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 60vh;
        text-align: center;
        padding: var(--s-8);
      }
      .not-found h2 {
        margin-bottom: var(--s-4);
      }
      .back-link {
        margin-top: var(--s-6);
        padding: var(--s-3) var(--s-8);
        background: var(--color-accent);
        color: var(--color-accent-fg);
        border-radius: var(--r-sm);
        font-weight: 500;
        text-decoration: none;
        transition: background var(--dur-1) var(--ease-out);
      }
      .back-link:hover {
        background: var(--color-accent-hover);
      }
    `,
  ],
})
export class NotFoundComponent {}
