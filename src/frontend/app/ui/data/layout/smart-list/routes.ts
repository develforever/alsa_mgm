import { AddComponent } from "./add.component";
import { EditComponent } from "./edit.component";
import { ViewComponent } from "./view.component";



export function createSidebarRoutes() {
    return [{
        path: "selected/:id",
        component: ViewComponent,
        title: "Produkt",
        outlet: "sidebar"
    },
    {
        path: "add",
        component: AddComponent,
        title: "Produkt New",
        outlet: "sidebar"
    },
    {
        path: "edit/:id",
        component: EditComponent,
        title: "Produkt Edit",
        outlet: "sidebar"
    },]
}