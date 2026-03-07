import { CommonModule } from "@angular/common";
import { Component, inject, signal, effect } from "@angular/core";
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Router,
  ActivatedRoute,
  NavigationEnd,
} from "@angular/router";
import { AuthService } from "./services/auth.service";
import { Title } from "@angular/platform-browser";
import { filter, map, mergeMap } from "rxjs/operators";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-root",
  host: {
    id: "app",
    class: "app",
  },
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive, MatSlideToggleModule, MatIconModule],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  authService = inject(AuthService);
  private titleService = inject(Title);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  protected readonly currentTitle = signal("");

  private route = inject(ActivatedRoute);

  dynamicMenu = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        const fullMenu: any[] = [];
        let currentRoute = this.route.root;

        while (currentRoute) {
          const items = currentRoute.snapshot.data['menuItems'];
          if (items && Array.isArray(items)) {
            fullMenu.push(...items);
          }
          currentRoute = currentRoute.firstChild!;
        }

        return fullMenu;
      })
    ),
    { initialValue: [] }
  );

  constructor() {


    effect(() => {
      this.titleService.setTitle(`${this.currentTitle()} -  ALSA`);
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.title),
      )
      .subscribe((title) => {
        if (title) {
          this.currentTitle.set(title);
        }
      });
  }
  onLogout() {
    if (confirm("Czy na pewno chcesz się wylogować?")) {
      this.authService.logout();
    }
  }
}
