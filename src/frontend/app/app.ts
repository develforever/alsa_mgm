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

@Component({
  selector: "app-root",
  imports: [RouterOutlet, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  authService = inject(AuthService);
  private titleService = inject(Title);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  protected readonly currentTitle = signal("");

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
