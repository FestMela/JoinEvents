import { Component, Input } from '@angular/core';

/**
 * Skeleton shimmer placeholder — drop-in replacement for per-page spinners.
 *
 * Usage:
 *   <app-skeleton type="text"  [count]="4" />           ← 4 text lines
 *   <app-skeleton type="circle" width="48px" />          ← avatar circle
 *   <app-skeleton type="card" />                         ← full card placeholder
 *   <app-skeleton type="rect" width="100%" height="200px" />
 *
 * Automatically respects dark mode through --bg-light / --bg-card tokens.
 */
@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    @switch (type) {
      @case ('circle') {
        <div class="skeleton skeleton-circle"
             [style.width]="width || '48px'"
             [style.height]="width || '48px'"></div>
      }
      @case ('card') {
        <div class="skeleton skeleton-card"
             [style.width]="width || '100%'"
             [style.height]="height || '200px'"></div>
      }
      @case ('heading') {
        <div class="skeleton skeleton-heading"
             [style.width]="width || '60%'"
             [style.height]="height || '1.5em'"></div>
      }
      @case ('rect') {
        <div class="skeleton skeleton-rect"
             [style.width]="width || '100%'"
             [style.height]="height || '80px'"></div>
      }
      @default {
        <!-- text lines -->
        @for (line of lines; track $index) {
          <div class="skeleton skeleton-text"
               [style.width]="$index === lines.length - 1 ? '70%' : (width || '100%')"
               [style.height]="height || '1em'"></div>
        }
      }
    }
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class SkeletonLoader {
  @Input() type: 'text' | 'circle' | 'card' | 'heading' | 'rect' = 'text';
  @Input() width  = '';
  @Input() height = '';
  @Input() count  = 3;

  get lines(): number[] {
    return Array.from({ length: this.count });
  }
}
