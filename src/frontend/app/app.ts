import { CommonModule } from "@angular/common";
import { Component, inject, signal, effect } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import {
  RouterLink,
  RouterOutlet,
  Router,
  ActivatedRoute,
  NavigationEnd,
} from "@angular/router";
import { AuthService } from "./services/auth.service";
import { Title } from "@angular/platform-browser";
import { filter } from "rxjs/operators";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AppTopMenu } from "./ui/TopMenu";
import { AppStoreService } from "./services/store.service";
import { BreadcrumbComponent } from "./ui/breadcrumb.component";
import { SimpleContextMenuComponent } from "./ui/context-menu/simple-context-menu.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { LanguageSelectorComponent } from "./core/language-selector.component";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { combineLatest, map, startWith } from "rxjs";

@Component({
  selector: "app-root",
  host: {
    id: "app",
    class: "app",
  },
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    AppTopMenu,
    BreadcrumbComponent,
    SimpleContextMenuComponent,
    MatSlideToggleModule,
    LanguageSelectorComponent,
    TranslocoModule
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  authService = inject(AuthService);
  private titleService = inject(Title);
  protected router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private translocoService = inject(TranslocoService);
  protected readonly currentTitle = signal<{ title: string, url: string }[]>([]);
  protected readonly appStore = inject(AppStoreService);


  constructor() {


    // Create a reactive title signal that waits for translations to be loaded
    const titles$ = combineLatest([
      toObservable(this.currentTitle),
      this.translocoService.selectTranslation().pipe(startWith(null))
    ]).pipe(
      map(([titles]) => {
        if (titles.length === 0) return '';
        return titles.map(t => this.translocoService.translate(t.title)).join(' > ');
      })
    );

    const translatedTitle = toSignal(titles$, { initialValue: '' });

    effect(() => {
      const title = translatedTitle();
      if (title) {
        this.titleService.setTitle(`${title} - ALSA`);
      }
    });

    const buildTitles = (): { title: string; url: string }[] => {
      const titles: { title: string, url: string }[] = [];
      let currentRoute: ActivatedRoute | null = this.activatedRoute.root;
      while (currentRoute) {
        const titleKey = currentRoute.snapshot.title;
        const parentTitle = currentRoute.parent?.snapshot.title;

        if (titleKey && parentTitle != titleKey) {
          let url: string;

          if (currentRoute.snapshot.outlet === 'primary') {
            url = '/' + currentRoute.snapshot.pathFromRoot
              .filter(r => r.outlet === 'primary')
              .flatMap(s => s.url)
              .map(u => u.path)
              .filter(p => !!p)
              .join('/');
          } else {
            const primaryPath = '/' + currentRoute.snapshot.pathFromRoot
              .filter(r => r.outlet === 'primary')
              .flatMap(s => s.url)
              .map(u => u.path)
              .filter(p => !!p)
              .join('/');
            const outletSegment = currentRoute.snapshot.url.map(u => u.path).join('/');
            url = `${primaryPath}/(${currentRoute.snapshot.outlet}:${outletSegment})`;
          }

          // Store the key/string as is. The breadcrumb component will handle translation reactively.
          titles.push({
            title: titleKey,
            url: url
          });
        }
        currentRoute = currentRoute.firstChild;
      }
      return titles;
    };

    // Rebuild breadcrumb on navigation
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe(() => {
        this.currentTitle.set(buildTitles());
      });

    // Rebuild breadcrumb on language change is no longer needed here 
    // as the component template will react to the pipe.
  }
  onLogout() {
    if (confirm(this.translocoService.translate('AUTH.CONFIRM_LOGOUT'))) {
      this.authService.logout();
    }
  }
}
