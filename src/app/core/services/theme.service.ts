import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(localStorage.getItem('theme') === 'dark');

  constructor() {
    effect(() => {
      const mode = this.isDarkMode();
      localStorage.setItem('theme', mode ? 'dark' : 'light');

      // Use documentElement (<html>) for consistency with the FOUC-prevention
      // blocking script that also targets <html>.
      const el = document.documentElement;
      if (mode) {
        el.classList.add('dark-theme');
        el.style.backgroundColor = '#0F172A';
        el.style.colorScheme = 'dark';
      } else {
        el.classList.remove('dark-theme');
        el.style.backgroundColor = '';
        el.style.colorScheme = '';
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
  }
}
