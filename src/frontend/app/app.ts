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
    AppTopMenu
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  authService = inject(AuthService);
  private titleService = inject(Title);
  protected router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  protected readonly currentTitle = signal<string[]>([]);

  constructor() {


    effect(() => {
      this.titleService.setTitle(`${this.currentTitle()} -  ALSA`);
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const titles: string[] = [];
          let currentRoute: ActivatedRoute | null = this.activatedRoute.root;

          while (currentRoute) {
            const title = currentRoute.snapshot.title;
            const parentTitle = currentRoute.parent?.snapshot.title;

            if (title && parentTitle != title) {
              titles.push(title);
            }
            currentRoute = currentRoute.firstChild;
          }

          return titles.reverse();
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
