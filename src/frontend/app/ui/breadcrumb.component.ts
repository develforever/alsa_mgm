import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";


@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrl: './breadcrumb.component.scss',
    imports: [CommonModule, RouterLink, RouterLinkActive],
})
export class BreadcrumbComponent {
    @Input() items: { title: string, url: string }[] = [];
}