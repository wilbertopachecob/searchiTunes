import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-header />
    <main class="app-shell">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {}
