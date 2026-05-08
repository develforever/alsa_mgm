import { CommonModule } from "@angular/common";
import { Component, Input, inject } from "@angular/core";
import { Router } from "@angular/router";


import { TranslocoModule } from "@jsverse/transloco";

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrl: './breadcrumb.component.scss',
    imports: [CommonModule, TranslocoModule],
})
export class BreadcrumbComponent {
    @Input() items: { title: string, url: string }[] = [];
    private router = inject(Router);

    navigate(event: MouseEvent, url: string): void {
        event.preventDefault();
        this.router.navigateByUrl(url);
    }
}