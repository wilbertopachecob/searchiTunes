import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-loading-state',
  imports: [MatProgressSpinnerModule, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <div class="loading-panel" role="status" [attr.aria-label]="message() || ('common.loading' | translate)">
        <mat-spinner diameter="40" />
        @if (message()) {
          <p class="loading-message">{{ message() }}</p>
        }
        @if (skeletonCount() > 0) {
          <div class="skeleton-grid">
            @for (item of skeletonItems(); track item) {
              <div class="skeleton-card" [attr.aria-hidden]="true">
                <div class="skeleton-cover"></div>
                <div class="skeleton-lines">
                  <div class="skeleton-line skeleton-line--title"></div>
                  <div class="skeleton-line skeleton-line--subtitle"></div>
                  <div class="skeleton-line skeleton-line--price"></div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    }
  `,
})
export class LoadingStateComponent {
  readonly loading = input(false);
  readonly message = input('');
  readonly skeletonCount = input(0);

  readonly skeletonItems = computed(() =>
    Array.from({ length: Math.max(0, this.skeletonCount()) }, (_, index) => index),
  );
}
