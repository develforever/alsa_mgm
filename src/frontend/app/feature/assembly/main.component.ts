import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";



@Component({
    selector: 'assembly-main-component',
    template: `<router-outlet></router-outlet> `,
    imports: [RouterOutlet],
})
export class MainAssemblyComponent { }