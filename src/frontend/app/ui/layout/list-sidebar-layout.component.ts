import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatCardHeader } from "@angular/material/card";
import { MatCardContent } from "@angular/material/card";

@Component({
    selector: 'app-list-sidebar-layout',
    templateUrl: './list-sidebar-layout.component.html',
    styleUrls: ['./list-sidebar-layout.component.scss'],
    host: {
        class: 'flex flex-gap-1'
    },
    imports: [RouterOutlet, CommonModule, MatCardModule, MatCardHeader, MatCardContent],
})
export class ListSidebarLayoutComponent {


    isSidebarActive = signal(false);
    onActivate() { this.isSidebarActive.set(true); }
    onDeactivate() { this.isSidebarActive.set(false); }

}