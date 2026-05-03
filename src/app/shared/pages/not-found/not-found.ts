import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-page">
      <div class="not-found-content fade-in-up">
        <div class="glitch-code">404</div>
        <h1 class="not-found-title">Page Not Found</h1>
        <p class="not-found-msg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="not-found-actions">
          <a routerLink="/" class="btn-ee-primary">
            <i class="bi bi-house-door"></i> Back to Home
          </a>
          <a routerLink="/login" class="btn-ee-outline">
            <i class="bi bi-box-arrow-in-right"></i> Login
          </a>
        </div>
      </div>
      <div class="not-found-decor">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-app);
      position: relative;
      overflow: hidden;
      padding: 24px;
    }
    .not-found-content {
      text-align: center;
      position: relative;
      z-index: 2;
    }
    .glitch-code {
      font-family: var(--font-heading);
      font-size: clamp(6rem, 18vw, 12rem);
      font-weight: 900;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      letter-spacing: -4px;
      margin-bottom: 8px;
      animation: float 3s ease-in-out infinite;
    }
    .not-found-title {
      font-family: var(--font-heading);
      font-size: clamp(1.5rem, 4vw, 2rem);
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 12px;
    }
    .not-found-msg {
      font-size: 1rem;
      color: var(--text-muted);
      max-width: 420px;
      margin: 0 auto 32px;
      line-height: 1.6;
    }
    .not-found-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    /* Decorative floating orbs */
    .not-found-decor { position: absolute; inset: 0; pointer-events: none; }
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.18;
    }
    .orb-1 {
      width: 400px; height: 400px;
      background: var(--primary);
      top: -10%; right: -5%;
      animation: float 6s ease-in-out infinite;
    }
    .orb-2 {
      width: 300px; height: 300px;
      background: var(--secondary);
      bottom: -8%; left: -5%;
      animation: float 8s ease-in-out infinite reverse;
    }
    .orb-3 {
      width: 200px; height: 200px;
      background: var(--accent);
      top: 40%; left: 50%;
      animation: float 5s ease-in-out infinite 1s;
    }
  `]
})
export class NotFoundPage {}
