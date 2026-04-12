import { CommonModule } from "@angular/common";
import { Component, inject, signal, effect } from "@angular/core";
import {
  RouterLink,
  RouterOutlet,
  Router,
  ActivatedRoute,
  NavigationEnd,
} from "@angular/router";
import { AuthService } from "./services/auth.service";
import { Title } from "@angular/platform-browser";
import { filter, map } from "rxjs/operators";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AppTopMenu } from "./ui/TopMenu";
import { AppStoreService } from "./services/store.service";
import { BreadcrumbComponent } from "./ui/breadcrumb.component";
import { SimpleContextMenuComponent } from "./ui/context-menu/simple-context-menu.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

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
    MatSlideToggleModule
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  authService = inject(AuthService);
  private titleService = inject(Title);
  protected router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  protected readonly currentTitle = signal<{ title: string, url: string }[]>([]);
  protected readonly appStore = inject(AppStoreService);


  constructor() {


    effect(() => {
      this.titleService.setTitle(`${this.currentTitle().map(t => t.title).join(' > ')} -  ALSA`);
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const titles: { title: string, url: string }[] = [];
          let currentRoute: ActivatedRoute | null = this.activatedRoute.root;
          while (currentRoute) {
            const title = currentRoute.snapshot.title;
            const parentTitle = currentRoute.parent?.snapshot.title;

            if (title && parentTitle != title) {
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

              titles.push({
                title: title,
                url: url
              });
            }
            currentRoute = currentRoute.firstChild;
          }

          return titles;
        })
      )
      .subscribe((fullTitle) => {
        if (fullTitle) {
          this.currentTitle.set(fullTitle);
        }
      });
  }
  onLogout() {
    if (confirm("Czy na pewno chcesz się wylogować?")) {
      this.authService.logout();
    }
  }
}
